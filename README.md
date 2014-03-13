Notes to self:

- Need to account for user logging out from a different browser window; redirect to hime screen

- Need to set up a sync to notify when a new email comes in and save it to the database
see: Node events library
http://nodejs.org/api/events.html

- Modified the cheerio library to add a delimiter to the .text() method

<!-- // Amazon page link product title;
// <div class="a-section a-spacing-none">
//     <h1 id="title" class="a-size-large a-spacing-none">
//       <span id="productTitle" class="a-size-large">Garcinia Cambogia Extract - 1600 mg Servings (only 2 capsules/day)- Pure 100 % Natural GMO Free Effective Appetite Suppressant and Weight Loss Supplement from Omega Soul</span>

//     </h1>
// </div> -->

-- ISSUES
- Fix route from sign-up --> view messages; note that route url says "/register"

Commit Notes
Incorporated date swig filter (for front end demo);