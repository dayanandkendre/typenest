import {
db
}
from "./firebase-config.js";

import {
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const leaderboardBox =

document.getElementById(
"leaderboardBox"
);


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

let users = [];

snapshot.forEach((doc)=>{

users.push(
doc.data()
);

});

console.log(users);

users.sort(function(a,b){

## return (b.bestWpm || 0)

(a.bestWpm || 0);

});

console.log(
"SORTED USERS:",
users
);

leaderboardBox.innerHTML = "";

users.forEach(function(user,index){

leaderboardBox.innerHTML += `
<div class="leader-row">
<div class="rank">
#${index + 1}
</div>

<div class="user">
${user.name || "User"}
</div>

<div class="wpm">
${user.bestWpm || 0} WPM
</div>

</div>
`;

});

