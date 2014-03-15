Notes to self:
===== OPEN ISSUES =====
- Need to account for user logging out from a different browser window; redirect to home screen

- Fix route from sign-up --> view messages; note that route url says "/register"

- Need to set up a sync to notify when a new email comes in and save it to the database
see: Node events library
http://nodejs.org/api/events.html

- use username and date after parameters for subsequent context.io queries

===== NEW FEATURES =====
- Get link for each product on amazon page

- Incoporate functionality to parse order update emails (see email from <order-update@amazon.com>)

- Account for random emails from users in the database

- Add ability for an account to have multiple email addresses (aliases?)

== For v2 ==
- Add functionality to crawl the tracking no page/


<!-- <div class="tracking-progress status-delivered">
    <div class="progress-indicator">
      <h2 class="hide-fromsighted">delivered</h2>
    </div>
  <div class="progress-details">
    <ul>
        <li>
          <span class="label">Expected Delivery Day:</span>
          <span class="value">Thursday, March 13, 2014</span>
        </li>
    </ul>
  </div>
</div> -->



===== Commit Notes =====
- Reconfigured mongoose schema


===== RESOVLED =====
- Incorporated date swig filter (for front end demo);
- Modified the cheerio library to add a delimiter to the .text() method (BOOOOOO) -- SEE .map functionality