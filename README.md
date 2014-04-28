# GET YOUR SHIP TOGETHER (GYST)

Users forward their Amazon shipping confirmation emails to we.gyst@gmail.com. From there, Get Your Ship Together (GYST) pulls and parses their emails to extract the product information, Amazon order ID, expected delivery date, and the tracking number. Upon visiting the site, users can (1) view their shipments in a tabular format and (2) click a button to have their shipments added to their Google Calendar based on the expected delivery date of each shipment.


===== OPEN ISSUES =====
- Need to account for user logging out from a different browser window; redirect to home screen

- Fix route from sign-up --> view messages; note that route url says "/register"

- Use username and date after parameters for subsequent context.io queries

===== NEW FEATURES TO ADD =====
- Get link for each product on amazon page

- Incoporate functionality to parse order update emails (see email from <order-update@amazon.com>)

- Account for random emails from users in the database

- Add nodemailer for confirmation to user when forwarded an email

== For v2 ==
- Add functionality to crawl the tracking no page