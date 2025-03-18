# Moderation

GitHub is a content management system that accepts updates from accounts created within the last five minutes. It's great because well-meaning people can create an account and report an issue quickly. It's also subject to abuse. We see inauthentic/abusive issues, PRs, and comments on a regular basis. It is important to know what to do.

We use the "see something, say something" model. Please report content that you think should be addressed or removed to one of our [Moderators](http://aka.ms/dotnet/org).

Note: the term "issue" will be used to mean both issue and PR.

## Self-service

If you see an issue that is of significant concern, please bias to action. We trust your judgement.

The quickest and most important action you can take is to close an issue. This will remove the problematic content from view for most people. This action can provide time for the moderators to act.

The bar for closing an issue should be low. We can always re-open it if that's the right choice. Don't write a response about code of conduct violations and "do better next time". Just close the issue. Leave the response (if one is needed at all) to the moderators.

GitHub offers a self-service "Report content" capability. Using it is a great option. It is often the case that a user is behaving in similar ways in multiple communities/orgs. GitHub will notice this and can act based on their broader perspective.

![Image](https://github.com/user-attachments/assets/bd84e1d8-92bc-48c6-9296-05f117554c46)

## Signs

It is often obvious that a user is acting in bad faith. We often look at user profiles for more information.

High bias to bad-faith:

- Account is new
- Profile is private
- Profile is public with similar repeated activity in other repos/orgs

There is a natural instinct to try to help someone who might just not have the skills or experience to participate per our norms. That's good! People that need help tend to identify themselves with very different signal than bad actors. They never start with a 5000 file PR or update our CI infra.

## Common activity

Bad-faith activity is a very broad topic.

Examples:

- Reposting our announcements, often in the same repo
- Posting malicious code (think crypto miners) as helpful samples
- PRs that delete or update files for no obvious reason
- PRs that run scripts that establish a reverse shell with the intent to exfiltrate secrets

The bigger the "contribution", the more you should be concerned. It is very easy to hide malicious payload amongst the noise. See [XZ backdoor](https://en.wikipedia.org/wiki/XZ_Utils_backdoor).
