# Minerva Todo list - Launch list - Ecom list - Live list - Ecom live list

This app will have 5 set lists to choose from.

<hr>

<h2>Launch Checklist</h2>
<p>The launch checklist will contain the bulk:</p>
<ul>

<h3>Content</h3>
<li>Text checked and free from spelling, grammatical, factual and formatting errors</li>
<li>Page titles and meta data unique, consistent and descriptive</li>
<li>Images have appropriate alternative (alt) text</li>
<li>Navigation easy to find and use, and all links working</li>
<li>404 page created and serving correctly</li>
<li>GDPR compliant terms and conditions or privacy policy pages created</li>
<li>IF cookies : GDPR compliant cookie information policy/banner created</li>
<li>Footer copyright notice included and year(s) correct</li>
<li>Internal backlinks done correctly</li>

<h3>Communication</h3>
<li>Forms working correctly and email notifications reaching correct people</li>
<li>Form success handling is implemented correctly and has a thank you message</li>
<li>Contact details correct and easy to find</li>
<li>Links to social media accounts present and correct</li>

<h3>Benchmarks & Performance</h3>
<li>HTML W3C valid</li>
<li>CSS W3C valid</li>
<li>Website run through Pagespeed Insights / pingdom and results adequate</li>
<li>Website run through Mobile Friendly Test and results adequate</li>
<li>HTML, CSS and JS files minified and concatenated where possible</li>
<li>Images and videos adequate quality and compressed as small as possible</li>
<li>Optimize images and compress as much as possible</li>

<h3>Compatibility</h3>
<li>Website tested and working in all targeted browsers</li>
<li>Website tested and working on mobile devices and tablets</li>
<li>Favicon and touch icons for mobile devices present</li>
<li>Website functions for visitors with Javascript disabled OR handled accordingly</li>
<li>Ensure security implementations are functional and not blocking incorrectly</li>
<li>Have a spam filter solution</li>
<li>SEO solution is implemented and working as expected</li>

<h3>Accessibility</h3>
<li>Links are easily recognisable and have a clear focus state</li>
<li>All form fields have associated labels (not placeholder text)</li>
<li>ARIA landmark roles used where appropriate</li>
<li>Color contrast is appropriate</li>

<h3>Infrastructure</h3>
<li>Domain name and web hosting set up and linked</li>
<li>IF premium : Automatic backups configured and working</li>
<li>SSL certificate installed</li>
<li>Files fully integrated with version control and deploy path set up</li>
<li>Logins are secure passwords</li>

<h3>Analytics</h3>
<li>Analytics tracking installed and working</li>
<li>Event tracking set up and working for key metrics</li>
<li>Search console account set up and linked</li>

<h3>htaccess & Robots</h3>
<li>GZIP enabled</li>
<li>301 redirects to pages which no longer exist set up</li>
<li>Expires caching activated</li>
<li>Clean URL rewrites in place and working</li>
<li>All versions of URL redirecting to same format</li>
<li>robots.txt file not blocking search engine spiders</li>

<h3>Ready to go!</h3>
<li>Final check for cross-browser compatability</li>
<li>Final check for responsiveness / mobile friendly</li>
<li>Final check on multiple devices (desktop, laptop, tablet, phone)</li>
<li>Take backup of website</li>
</ul>

<hr>

<h2>Live list</h2>
<p>The Live list will contain the following:</p>
<ul>
<li>Is the website displaying properly on the live url</li>
<li>Are all assests mapped correctly - no soft 404s for missing resources</li>
<li>Analytics is tracking properly and capturing necessary data</li>
<li>Google Search Console is tracking properly</li>
<li>Google business profile setup and directing to the correct place</li>
<li>Live test of security implementation</li>
<li>Review bounce rates and figuring out what is / isn't working</li>
<li>Forms still function as intended</li>
<li>Disable server and application error reporting and logging</li>
</ul>
<hr>
<h2>Ecommerce list</h2>
<p>The ecom list will contain all info from website checklist plus the following:</p>
<ul>
<li>Add any available sales channels</li>
<li>Check payment gateway - ensure all payments are being processed or rejected as intended</li>
<li>Manage 301 redirects for product categories etc</li>
<li>Check tax rates for governing state</li>
<li>IF physical location : ensure location and contact details are correct</li>
<li>Check that given shipping method provides correct rates</li>
<li>Submit xml sitemap to search console</li>
<li>IF coupon codes : test to ensure they are working for specified conditions</li>
<li>Ensure order data is going through correct channels</li>
</ul>
<hr>
<h2>Ecommerce live list</h2>
<p>The ecom live list will contain all info from live list plus the following:</p>
<ul>
<li>Create new customer account</li>
<li>Login as a new customer (try forgot password as well)</li>
<li>Place test order via new account (reviewing payment, tax, and shipping)</li>
<li>Turn off developer mode and any other developer tools</li>
<li>Backup all data (order, customers, products, etc)</li>
<li>Setup downtime alerts</li>
</ul>

<h2>Dependencies</h2>
<ul>
<li>React</li>
<li>React Router</li>
</ul>

# TODO

## App

<ol>
<li>Add navigation</li>
<li>Change color scheme, not liking the red combo anymore</li>
<li>/all-lists - Figure out better layout for all lists page. Ugly</li>
<li>/ - Display list types and total counts on home page on right side, will figure out main content</li>
<li><del>/lists/:type - Add functionality to delete btn</del></li>
<li><del>/lists/:type - Add searchbar at top of component. Will add new state to handle this</del></li>
<li><del>/list/:id - Create page that displays the selected list. Add CRUD abilities here</del></li>
<li><del>/lists/:type - fix search feature. Clearing all input with crtl+bksp messes up display results</del></li>
<li><del>/add-list - figure out why when linking directly to the new list it doesn't carry the necessary information to display the list</del></li>
</ol>

## Lists

<ol>
<li>Figure out routing for viewing single lists - will be using ID in url to view specific list</li>
<li>Add routing for viewing all lists</li>
<li>Ensure updating list items works as intended</li>
<li>Will work on CRUD abilities for lists once the routes are in place and have all necessary information</li>
<li>Add ability to delete items</li>
<li>Fix percentage calc</li>
<li>Handle errors: cant access list, cant find list, no list id in url</li>
<li>Create comment section. Figure out how to make it a wsywig like editor (maybe - maybe not)</li>
<li>Create modal that asks for second confirmation, then move on to delete function, delete function will save removed list, a display will ask if they want to restore the removed list.</li>
<li>For todos - display name. For others: display name - ${type of list}</li>
<li>/add-list - Set sessions token for list type on AddList route</li>

</ol>

## Users

<ol>
<li>Will need a signup route protected by a specific password</li>
<li>Will need a route to add users once signed in, and verify user is superadmin or some shit</li>
<li>Ability to view all users</li>
<li>CRUD abilities panel for superadmin</li>
<li>Update User schema on server to include username space and other customizable poritions as needed</li>
</ol>
