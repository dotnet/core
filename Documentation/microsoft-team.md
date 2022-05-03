# Microsoft Team Onboarding

If you work on or with the .NET Team, you will need to onboard into various GitHub projects in order to get your work done.

## Join .NET teams in dotnet and Microsoft orgs

[Link your GitHub account](https://repos.opensource.microsoft.com/link) with Microsoft and then join our teams (in two organizations):

1. [Join the microsoft/dotnet team](https://repos.opensource.microsoft.com/Microsoft/teams/dotnet/join/)
1. [Join the dotnet/microsoft team](https://repos.opensource.microsoft.com/dotnet/teams/microsoft/join/)

## Security best practices

Bad actors try to break into our accounts all the time (see ["failed login attempts" on your account](https://github.com/settings/security-log?q=action%3Auser.failed_login)). You need to apply the following guidance to (A) stay secure, and (B) maintain access to your account.

The following best practices are required for org owners, and recommended for repo admins.

* Do not use [SMS](https://en.wikipedia.org/wiki/SIM_swap_scam) for 2FA or as a recovery fallback (disable those options).
* Do use the [GitHub mobile app](https://github.blog/2022-01-25-secure-your-github-account-github-mobile-2fa/) for 2FA.
* Do register a [security key(s)](https://www.yubico.com/works-with-yubikey/catalog/github/) as a two factor method.
* Do register an authenticator app -- registering a one-time-password with an app like 1Password is recommended (not tied to your phone).
* Do store recovery codes in a safe place, like [OneDrive Vault](https://www.microsoft.com/microsoft-365/onedrive/personal-vault), 2FA-protected OneNote or in a password vault like 1Password.

Note: If you completely lose access to login to your account, GitHub support will not be able to recover your account. That's why all of these options are covered.

A correctly configured account should look similar to the following:

![image](https://user-images.githubusercontent.com/2608468/166490511-557e41e3-2fe0-45a6-a67b-425bf6800be1.png)

Please test your security key to ensure it works. For example, on Windows, you should see a dialog similar to the following (that says "security key"):

![image](https://user-images.githubusercontent.com/2608468/83581665-56980400-a4f4-11ea-8096-ddd553d28e18.png)

A few more notes on hardware keys:

* You should have at least one hardware key that does not travel with you, but is stored in a secure location (like at home) as a last resort in case you lose access to other factors.
* If you have a FIDO2 key, it can be used with [mysignins](https://mysignins.microsoft.com/).
* If you have USB-C and USB-A only devices, and want to use hardware keys for them, then you need [separate keys](https://www.yubico.com/works-with-yubikey/catalog/github/). This explains why the example below has multiple keys registered (for example, one securely stored at home, and two keys for daily use for USB-C and USB-A only devices).
* You can use Windows Hello to sign in as a hardware key. This is fine to use, but it doesn't replace the need for hardware key that you store in a secure location. Your Windows Hello key is not tied to you, but the machine. It won't survive hardware failures or re-installing Windows.

## Configure your GitHub account as a Microsoft employee (recommended)

* Publicly associate yourself with dotnet and Microsoft orgs
  * For Microsoft, go to <https://github.com/orgs/Microsoft/people>.
  * For dotnet, go to <https://github.com/orgs/dotnet/people>.
  * Search for your GitHub handle in the list.
  * Choose `Public` from the drop-down list of organization visibility.
  * Note: Everyone will now see an org badge on your GH profile in the Organizations section.
* Update your profile
  * Go to <https://github.com/settings/profile>.
  * Match your **Name** on GitHub with full name in address book (so other employees can find you and contact you internally when needed).
  * Set `@Microsoft` as your **Company**,
  * Upload your **picture**, ideally showing your face.
    * Hint: You can grab your GAL picture from <https://microsoft-my.sharepoint.com>.
 * Easily identify other Microsoft employees with our [browser extension](https://docs.opensource.microsoft.com/tools/browser.html)

## Get write permissions to repos (optional)

Join teams to gain write access to repos:

* Request team membership via <https://repos.opensource.microsoft.com/teams>.
* Ask someone if you don't know which team(s) to join.
* Select `Request to join this team` on the right side - it will send email request to maintainers of the team.
