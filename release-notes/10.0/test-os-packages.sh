#!/bin/bash
# Test script to verify os-packages.json package names are correct
# Usage: ./test-os-packages.sh [distro] [version]
# Example: ./test-os-packages.sh ubuntu 24.04
# Example: ./test-os-packages.sh  # runs all tests

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Map distro+version to Docker image
get_docker_image() {
    local distro="$1"
    local version="$2"

    case "$distro" in
        alpine)
            echo "alpine:${version}"
            ;;
        azure-linux)
            echo "mcr.microsoft.com/azurelinux/base/core:${version}"
            ;;
        centos-stream)
            echo "quay.io/centos/centos:stream${version}"
            ;;
        debian)
            echo "debian:${version}"
            ;;
        fedora)
            echo "fedora:${version}"
            ;;
        opensuse-leap)
            echo "opensuse/leap:${version}"
            ;;
        rhel)
            # Use UBI (Universal Base Image) as RHEL substitute
            echo "registry.access.redhat.com/ubi${version}/ubi"
            ;;
        sles)
            # SLES requires subscription; use openSUSE as proxy test
            echo "opensuse/leap:${version}"
            ;;
        ubuntu)
            echo "ubuntu:${version}"
            ;;
        freebsd)
            echo "SKIP:FreeBSD not available as Docker image"
            ;;
        *)
            echo "UNKNOWN:${distro}"
            ;;
    esac
}

# Get install command for distro
get_install_script() {
    local distro="$1"
    local packages="$2"

    case "$distro" in
        alpine)
            echo "apk add --no-cache $packages"
            ;;
        azure-linux)
            echo "tdnf install -y $packages"
            ;;
        centos-stream|fedora|rhel)
            echo "dnf install -y $packages"
            ;;
        debian|ubuntu)
            echo "apt-get update && apt-get install -y $packages"
            ;;
        opensuse-leap|sles)
            echo "zypper install -y $packages"
            ;;
        *)
            echo "echo 'Unknown distro: $distro'"
            ;;
    esac
}

# Parse os-packages.json and extract packages for a distro/version
get_packages() {
    local distro="$1"
    local version="$2"
    local json_file="${SCRIPT_DIR}/os-packages.json"

    # Normalize distro name for matching (remove dashes, lowercase)
    local distro_pattern="${distro//-/ }"

    # Use jq to extract package names
    jq -r --arg distro "$distro_pattern" --arg version "$version" '
        .distributions[] |
        select(.name | ascii_downcase | contains($distro | ascii_downcase)) |
        .releases[] |
        select(.release == $version) |
        .packages[].name
    ' "$json_file" | tr '\n' ' '
}

# Test a single distro/version combination
test_distro() {
    local distro="$1"
    local version="$2"

    local image=$(get_docker_image "$distro" "$version")

    if [[ "$image" == SKIP:* ]]; then
        echo "SKIP: ${distro} ${version} - ${image#SKIP:}"
        return 0
    fi

    if [[ "$image" == UNKNOWN:* ]]; then
        echo "ERROR: Unknown distro ${distro}"
        return 1
    fi

    local packages=$(get_packages "$distro" "$version")

    if [[ -z "$packages" ]]; then
        echo "ERROR: No packages found for ${distro} ${version}"
        return 1
    fi

    local install_cmd=$(get_install_script "$distro" "$packages")

    echo "----------------------------------------"
    echo "Testing: ${distro} ${version}"
    echo "Image: ${image}"
    echo "Packages: ${packages}"
    echo "Command: ${install_cmd}"
    echo "----------------------------------------"

    if docker run --rm "$image" /bin/sh -c "$install_cmd"; then
        echo "SUCCESS: ${distro} ${version}"
        return 0
    else
        echo "FAILED: ${distro} ${version}"
        return 1
    fi
}

# Get all distro/version combinations from os-packages.json
get_all_combinations() {
    local json_file="${SCRIPT_DIR}/os-packages.json"

    jq -r '
        .distributions[] |
        .name as $distro |
        .releases[] |
        "\($distro | ascii_downcase | gsub(" "; "-")):\(.release)"
    ' "$json_file"
}

# Main
main() {
    if ! command -v jq &> /dev/null; then
        echo "ERROR: jq is required but not installed"
        exit 1
    fi

    if ! command -v docker &> /dev/null; then
        echo "ERROR: docker is required but not installed"
        exit 1
    fi

    local failed=0
    local passed=0
    local skipped=0

    if [[ $# -eq 2 ]]; then
        # Test specific distro/version
        if test_distro "$1" "$2"; then
            ((passed++))
        else
            ((failed++))
        fi
    elif [[ $# -eq 0 ]]; then
        # Test all combinations
        while IFS=: read -r distro version; do
            test_distro "$distro" "$version"
            result=$?
            if [[ $result -eq 0 ]]; then
                ((passed++))
            else
                ((failed++))
            fi
            echo ""
        done < <(get_all_combinations)
    else
        echo "Usage: $0 [distro] [version]"
        echo "Examples:"
        echo "  $0                    # Test all distros"
        echo "  $0 ubuntu 24.04       # Test specific distro/version"
        exit 1
    fi

    echo "========================================"
    echo "Results: ${passed} passed, ${failed} failed, ${skipped} skipped"
    echo "========================================"

    if [[ $failed -gt 0 ]]; then
        exit 1
    fi
    exit 0
}

main "$@"
