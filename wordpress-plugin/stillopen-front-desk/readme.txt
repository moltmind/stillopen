=== StillOpen Front Desk ===
Contributors: stillopenpro
Tags: chat, chatbot, ai, live chat, customer service
Requires at least: 6.0
Tested up to: 7.0
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Your 24/7 AI front desk on your WordPress site. Paste one ID from your welcome email and the chat bubble is live.

== Description ==

Nobody who reaches out to you gets nothing.

StillOpen is an AI front desk that answers your customers on your website when you can't. It knows your real services, your real hours, and your real prices, because it reads your site. It answers at 2am the same way it answers at 2pm, and it tells you the second somebody real is on the other end.

This plugin is the install. No theme files, no code snippets, no FTP. Turn it on, paste the front desk ID from your welcome email, save, and the bubble shows up on your site.

**What the front desk does**

* Answers questions using your own services, hours, service area, and published prices
* Answers in whatever language the visitor types in
* Books appointments into your Google Calendar once you connect it
* Can take a Stripe deposit on an emergency slot so a late-night call is a real commitment on both sides
* Notifies you when a lead or a booking lands
* Gives you a morning report of everything it caught overnight

**What it doesn't do**

It doesn't answer your phone. It's text chat on your website. Voice isn't shipped, and this plugin won't pretend otherwise.

**You need a StillOpen account**

This plugin puts your front desk on your site. It doesn't create one. StillOpen is a paid service from a third party: 14 days free, then $47 a month, cancel any time. Start at [stillopen.ai](https://stillopen.ai/).

== Installation ==

1. Install the plugin and activate it.
2. Go to Settings, then StillOpen Front Desk.
3. Paste the front desk ID from your StillOpen welcome email. It starts with `user_`.
4. Save.
5. Open your site in a new tab. The chat bubble is in the bottom corner.

That's the whole install. If the bubble doesn't show up, make sure your theme calls `wp_footer()`, which almost every theme does, and that a caching plugin isn't serving an old copy of the page.

== Frequently Asked Questions ==

= Where do I find my front desk ID? =

In the welcome email StillOpen sent you when you started your trial. It's on the line with the code, and it starts with `user_`. Copy just the ID, not the whole line. It's also on your dashboard at app.stillopen.ai.

= Do I need a paid StillOpen account? =

Yes. The plugin is free and it's the installer. The front desk itself is the service, and it's 14 days free, then $47 a month.

= Will it slow my site down? =

The widget loads after your page does and it's one small script from app.stillopen.ai. It doesn't block anything on your page.

= Does it work with my theme and my page builder? =

If your theme calls `wp_footer()`, yes. Elementor, Divi, Astra, Kadence, block themes, all of them do.

= What happens if I deactivate the plugin? =

The bubble comes off your site immediately. Your account and your conversation history don't move.

= What data leaves my site? =

The plugin itself stores one setting, your front desk ID, and prints one script tag. It sends nothing. The chat widget that script loads talks to StillOpen's servers to answer your visitors, which is the whole point of it.

== Third Party Service Disclosure ==

This plugin loads a script from StillOpen, a third party service, and the chat widget it loads sends visitor messages to StillOpen's servers so they can be answered.

* Script loaded: https://app.stillopen.ai/chatbot.js
* Service: https://stillopen.ai/
* Terms: https://stillopen.ai/terms.html
* Privacy: https://stillopen.ai/privacy.html

Nothing is loaded and nothing is sent until you save a front desk ID.

== Screenshots ==

1. The settings page. One field, one Save button, and it tells you whether your front desk is switched on.
2. The front desk answering a real question on a live site.

== Changelog ==

= 1.0.0 =
* First release. Settings page, one-field setup, footer embed, uninstall cleanup.

== Upgrade Notice ==

= 1.0.0 =
First release.
