# This is a simple script to assist in manually installing Microsoft.NETCore.App 1.0.1
# and is primarily meant to help Linux users encountering https://github.com/dotnet/cli/issues/3681
# Complete installers are expected to be available with a mid-September release rendering This
# script unneccessary.

echo ===========================================
read -p "Download and install 1.0.1 now? (y/n) " answer

if [ "$answer" == "y" ] || [ "$answer" == "Y" ]; then
    
    tmp_dir=~/tmp-update
    download="https://download.microsoft.com/download/B/0/0/B00543E8-54D9-4D4A-826B-84348956AA75/"

    rid=$(dotnet --info | grep "RID" | cut -d ":" -f2)
    rid="${rid##*( )}"
    istmpclean=0

    case $rid in
        *osx*)
            netcoreapp_dir="/usr/local/share/dotnet/shared/Microsoft.NETCore.App/"
        ;;
        *ubuntu*)
            netcoreapp_dir="/usr/share/dotnet/shared/Microsoft.NETCore.App/"
        ;;
        *)
            netcoreapp_dir="/opt/dotnet/shared/Microsoft.NETCore.App/"
        ;;
    esac #set netcoreapp location

    if [ -d $netcoreapp_dir"/1.0.1/" ]; then
        isinstalled=1
        echo
        echo "Looks like 1.0.1 is already installed." 
        echo "ls -al " $netcoreapp_dir
        echo 

        ls -al $netcoreapp_dir
        
        echo
        echo "Exiting install."
        echo ===========================================
	else # 1.0.1 installed

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
        esac #rid

        # Check to see if tmp-update has been left behind. If so, clean up first. 
        if [ -d $tmp_dir ]; then
            #tmp_dir left behind from previous attempt
            echo
            echo "Directory "$tmp_dir" already exists and needs to be cleaned before proceding."
            echo
            read -p "Clean up temporary files and locations used by this script (y/n)?" answer

            if [ "$answer" == "y" ] || [ "$answer" == "Y" ]; then
                cd ~
                sudo rm -r tmp-update/ 
                istmpclean=1 #tmp_dir removed
                echo $tmp_dir "removed."
                echo
            else
                istmpclean=0 #tmp_dir not removed
                echo "Cancelling temporary files and location clean up and exiting install."
                echo ========================================================================
                echo
            fi # clean tmp_dir
        else
            istmpclean=1 #tmp_dir not found
        fi # exists tmp_dir
        
        if [ $istmpclean == 1 ]; then
            # create ~/tmp-update and cd
            mkdir $tmp_dir && cd $tmp_dir

            # Get Microsoft.NETCore.App archive chosen above 
            echo "Downloading:" $archive
            curl -SL -O -# $download$archive

            echo
            echo "Extracting" $archive

            # Extract /shared
            tar -xvz -f $archive "./shared/Microsoft.NETCore.App/1.0.1/"

            # Move 1.0.1
            echo
            echo "Moving 1.0.1 to" $netcoreapp_dir
            sudo mv shared/Microsoft.NETCore.App/1.0.1 $netcoreapp_dir

            echo
            echo "Install complete. If it was successful you should see a 1.0.1 directory in the listing below."
            echo
            echo "ls -al " $netcoreapp_dir

            ls -al $netcoreapp_dir

            echo
            read -p "Clean up temporary files and locations created by this script (y/n)?" answer

            if [ "$answer" == "y" ] || [ "$answer" == "Y" ]; then
                cd ~
                sudo rm -r tmp-update/ 
                echo $tmp_dir "removed."
                echo
            else
                echo
                echo "Cancelling temporary files and location clean up and exiting install."
                echo ========================================================================
                echo
            fi #tmp file cleanup after successful install
        else
            echo "tmp_dir needs to be cleaned up before attempting to install."
        fi # tmpclean check
    fi # 1.0.1 installed
else #top level install decision
    echo
	echo "Exiting install."
    echo ===========================================
    echo
fi #top level install decision