# Gather Social

## Creating a new private network

- User (host/guest) should be able to sign in with OAuth (Facebook, Google, LinkedIn(?)).
- User should be able to choose role (host vs guest).
- Initial user (host) should be able to invite others to be hosts.
- User (host) should be able to purchase 30 days of access to a private social network.
- User (host) should be able to give private network a title. Ex. Bob and Lisa's wedding.
- User (host) should get a QR code/link associated with their network to share with guests.

## Getting others involved

- User (guest) should be able to join private network with associated password.
- User (guest) can only see a network if they have the QR/Link and have signed in via OAuth.
- User (guest) should be prompted to choose a photo so others can recognize them.
- User (guest) should be able to post multiple photos for the host to see.

## Getting photos from the event

- User (host) should have admin dashboard to choose which photos they want to save/download.

## App Flow (Host)
- Host visits and is met with landing page explaining how it works and sign in button. Href = '/'.
- Once signed in, user gets simple admin page with button to create a new event.
- User then names the event and hits create.
- Create takes them to the payment page.
- Once they pay, the new event is created. 
- Each event will have a link they can share with others and a QR code that can be scanned.

## App Flow (Guest)
- "Welcome to {title} Feed" and sign in button.
- Profile settings...
 - Photo (defaults to null in db and blank avatar)
 - Name (auto populated from Clerk/db).
 - Feed in cronological order.