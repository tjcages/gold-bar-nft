const functions = require("firebase-functions");
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

var Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: "",
});
var base = new Airtable.base(""); // removed for security

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.monitorRegistrations = functions.firestore
  .document("/attendees/{documentId}")
  .onCreate(async (snap, context) => {
    // Grab the current value of what was written to Firestore.
    const data = snap.data();
    const fields = {
      fields: {
        Attendance: data.attendance,
        Name: data.name,
        Email: data.email,
        Company: data.company,
        Title: data.title,
        ID: snap.id,
      },
    };

    base("NYC Attendees").create([fields], function (err, records) {
      if (err) {
        functions.logger.log("Error creating new user", err);
        return;
      }
      records.forEach(function (record) {
        return record;
      });
    });
  });

exports.monitorEvents = functions.firestore
  .document("/events/{documentId}")
  .onCreate(async (snap, context) => {
    // Grab the current value of what was written to Firestore.
    const data = snap.data();
    const fields = {
      fields: {
        Company: data.company,
        Email: data.email,
        "Event Capacity": data.eventCapacity,
        "Event Date": data.eventDate,
        "Event Description": data.eventDescription,
        "Event Link": data.eventLink,
        "Event Location": data.eventLocation,
        "Event Title": data.eventTitle,
        Name: data.name,
        Social: data.social,
        ID: snap.id,
      },
    };

    base("NYC Events").create([fields], function (err, records) {
      if (err) {
        functions.logger.log("Error creating new user", err);
        return;
      }
      records.forEach(function (record) {
        return record;
      });
    });
  });

// exports.migrateDatabase = functions.https.onRequest(
//   async (request, response) => {
//     const querySnapshot = db.collection("attendees");
//     querySnapshot
//       .get()
//       .then((querySnapshot) => {
//         const attendees = [];
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           const fields = {
//             fields: {
//               Attendance: data.attendance,
//               Name: data.name,
//               Email: data.email,
//               Company: data.company,
//               Title: data.title,
//               ID: doc.id,
//             },
//           };
//           attendees.push(fields);
//         });

//         console.log(JSON.stringify(attendees));

//         // Airtable only allows for 10 records to be created at a time
//         const chunkSize = 10;
//         var status = [];
//         for (let i = 0; i < attendees.length; i += chunkSize) {
//           const chunk = attendees.slice(i, i + chunkSize);

//           console.log("Chunked: ", JSON.stringify(chunk));

//           base("NYC Attendees").create(chunk, function (err, records) {
//             if (err) {
//               response.json({ status: "error", error: err });
//               return;
//             }
//             records.forEach(function (record) {
//               status.push({ status: "success" });
//             });
//           });
//         }

//         response.json({ status });
//       })
//       .catch((error) => {
//         console.log("Error getting documents: ", error);
//         response.json({ status: "Total Failure :(" });
//       });
//   }
// );
