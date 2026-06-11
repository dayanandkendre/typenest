import {
db
}
from "./firebase-config.js";

import {
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const snapshot =

await getDocs(
collection(
db,
"users"
)
);

console.log(
"TOTAL USERS:",
snapshot.size
);

snapshot.forEach((doc)=>{

console.log(
doc.data()
);

});
