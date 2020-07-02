# Microsoft Team Onboarding

If you work on or with the .NET Team, you will need to onboard into various GitHub projects in order to get your work done.

## Join .NET teams in dotnet and Microsoft orgs

You need to link your GitHub and @microsoft.com accounts. Click the link:

* [Link your GitHub account](https://repos.opensource.microsoft.com/link)

You need to join teams in two organizations. Click the two links:

* [dotnet org](https://repos.opensource.microsoft.com/dotnet/teams/microsoft/join/)
* [Microsoft org](https://repos.opensource.microsoft.com/microsoft/teams/dotnet/join/)

After you join the teams: 

* Users will be able to @mention you on [.NET Core Repos](https://github.com/dotnet/core/blob/master/Documentation/core-repos.md)
* You will be able to access to private repos we maintain
* You will get write access to a subset of repos

## Configure your GitHub account as a Microsoft employee (recommended)

* Publicly associate yourself with dotnet and Microsoft orgs
    * For Microsoft, go to https://github.com/orgs/Microsoft/people
    * For dotnet, go to https://github.com/orgs/dotnet/people
    * Search for your GitHub handle in the list
    * Choose `Public` from the drop-down list of organization visibility
    * Note: Everyone will now see an org badge on your GH profile in the Organizations section
* Update your profile
    * Go to https://github.com/settings/profile
    * Match your **Name** on GitHub with full name in address book (so other employees can find you and contact you internally when needed)
    * Set `@Microsoft` as your **Company**
    * Upload your **picture**, ideally showing your face
        * Hint: You can grab your GAL picture from https://microsoft-my.sharepoint.com

## Install Microsoft open source tools (recommended)

The tools make it easier to use open source and participate in open source projects:

* [Browser Extension](https://docs.opensource.microsoft.com/tools/browser.html) -- Identifies Microsoft employees on GitHub.
* [VS Code Extension](https://docs.opensource.microsoft.com/tools/vscode.html) --  Provides information about known vulnerabilities.

The browser extension is recommended. The VS code extension is optional.

## Get write permissions to repos (optional)

Join teams to gain write access to repos:
 * Request team membership via https://repos.opensource.microsoft.com/teams
 * Ask someone if you don't know which team(s) to join.
 * Select `Request to join this team` on the right side - it will send email request to maintainers of the team

## Security best practices

Enabling 2FA doesn't necessarily mean your account is secure. SMS (phone texts) is [not secure](https://en.wikipedia.org/wiki/SIM_swap_scam) as a 2FA method and should be avoided if possible. You can see [failed login attempts](https://github.com/settings/security-log?q=action%3Auser.failed_login) on your account to get some sense of the risk you have.

The following best practices are required for org owners, and recommended for repo admins. 

* Do register a [security key(s)](https://www.yubico.com/works-with-yubikey/catalog/github/) as a two factor method.
* Do register an authenticator app -- registering a one-time-password with an app like 1Password is recommended (not tied to your phone).
* Do store recorvery codes in a safe place, like [OneDrive Vault](https://www.microsoft.com/en-us/microsoft-365/onedrive/personal-vault), 2FA-protected OneNote or in a password vault like 1Password.
* Do register your GitHub account with your 2FA-protected Facebook account for GitHub account recovery. This is the absolute last recovery option and is considered secure (even if your Facebook account is breached).
* Do not use SMS for 2FA or as a recovery fallback.

Note: If you completely lose access to login to your account, GitHub support will not be able to recover your account. That's why all of these options are covered.

A few more notes on hardware keys:

* You should have at least one hardware key that does not travel with you, but is stored in a secure location (like at home) as a last resort in case you lose access to other factors.
* If you have a FIDO2 key, it can be used with [mysignins](https://mysignins.microsoft.com/).
* If you have USB-C and USB-A only devices, and want to use hardware keys for them, then you need [separate keys](https://www.yubico.com/works-with-yubikey/catalog/github/). This explains why the example below has three keys registered (one securely stored at home, and two keys for daily use for USB-C and USB-A only devices).
* You can use Windows Hello to signin as a hardware key. This is fine to use, but doesn't replace the need for hardware key that you store in a secure location.Your Windows Hello key is not tied to you, but the machine. It won't survive hardware failures or re-installing Windows.

A correctly configured account should look similar to the following:

![image](https://user-images.githubusercontent.com/2608468/83581219-1421f780-a4f3-11ea-8f01-3a27afe4ddac.png)

Please test your security key to ensure it works. You need to see a dialog similar to the following (that says "security key"):

![image](https://user-images.githubusercontent.com/2608468/83581665-56980400-a4f4-11ea-8096-ddd553d28e18.png)

Facebook-based account recovery registration will look similar to the following:

![image](https://user-images.githubusercontent.com/2608468/83581770-965eeb80-a4f4-11ea-993d-ad39bae391c2.png)

## Service Accounts

Service accounts should also be linked. For more details, see [Service accounts for GitHub](https://docs.opensource.microsoft.com/github/service-accounts.html).

## Guidelines

* [Contributing to .NET Core](https://github.com/dotnet/runtime/blob/master/CONTRIBUTING.md)
* [What you can expect from Maintainers](https://github.com/dotnet/core/blob/master/Documentation/contributing/maintainers.md)
