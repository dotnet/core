# This is a simple script to assist in manually installing Microsoft.NETCore.App 1.0.1
# and is primarily meant to help Linux users encountering https://github.com/dotnet/cli/issues/3681
# Complete installers are expected to be available with a mid-September release rendering This
# script unneccessary.  

read -p "Download and install 1.0.1 now? (y/n) " answer

if [ "$answer" == "y" ] || [ "$answer" == "Y" ]; then

    d2=~/tmp-update
    d3="Microsoft.NETCore.App/"
    download="https://download.microsoft.com/download/B/0/0/B00543E8-54D9-4D4A-826B-84348956AA75/"

    rid=$(dotnet --info | grep "RID" | cut -d ":" -f2)
    rid="${rid##*( )}"

    case $rid in
        *osx*)
            d1="/usr/local/share/dotnet/shared/Microsoft.NETCore.App/"
        ;;
        *ubuntu*)
            d1="/usr/share/dotnet/shared/Microsoft.NETCore.App/"
        ;;
        *)
            d1="/opt/dotnet/shared/Microsoft.NETCore.App/"
        ;;
    esac

    echo
    echo "dotnet identifies your machine as:" $rid
    echo

    case $rid in
        *osx.10*)
            archive="dotnet-osx-x64.1.0.1.tar.gz"
        ;;
        *ubuntu.14*)
            archive="dotnet-ubuntu-x64.1.0.1.tar.gz"
        ;;
        *ubuntu.16*)
            archive="dotnet-ubuntu.16.04-x64.1.0.1.tar.gz"
        ;;
        *debian*)
            archive="dotnet-debian-x64.1.0.1.tar.gz"
        ;;
        *centos*)
            archive="dotnet-centos-x64.1.0.1.tar.gz"
        ;;
        *rhel*)
            archive="dotnet-rhel-x64.1.0.1.tar.gz"
        ;;
        *opensus.13*)
            archive="dotnet-opensus.13.2-x64.1.0.1.tar.gz"
        ;;
        *fedora.23*)
            archive="dotnet-fedora.23-x64.1.0.1.tar.gz"
        ;;
    esac

    # Create temp directory for the archive download
    mkdir $d2 && cd $d2

    # Get Microsoft.NETCore.App archive chosen above 
    echo "Downloading:" $archive
    curl -SL -O -# $download$archive

    echo
    echo "Extracting" $archive


    # Extract /shared
    tar -xvz -f $archive "./shared/Microsoft.NETCore.App/1.0.1/"

    # Move 1.0.1
    echo
    echo "Moving 1.0.1 to" $d1
    sudo mv shared/Microsoft.NETCore.App/1.0.1 $d1

    echo
    echo "Install complete."
    echo

else
    echo
	echo "Exiting install."
    echo
fi