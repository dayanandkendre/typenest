// Row format: word|phonetic|part of speech|English meaning|Marathi meaning|sentence
const L = (id, name, description, rows) => ({
  id, name, description, difficulty: 'Beginner',
  words: rows.map(r => {
    const [word, phonetic, pos, en, mr, sentence] = r.split('|');
    return { word, phonetic, pos, en, mr, sentence };
  })
});

export const BEGINNER = [
  L(1, 'Greetings', 'Polite words for every day.', [
    'hello|/həˈləʊ/|interjection|A word used to greet someone.|नमस्कार|Hello, how are you?',
    'goodbye|/ˌɡʊdˈbaɪ/|interjection|A word said when leaving.|निरोप|Goodbye, see you tomorrow.',
    'please|/pliːz/|adverb|A polite word used when asking.|कृपया|Please sit down.',
    'thanks|/θæŋks/|noun|Words that show you are grateful.|धन्यवाद|Thanks for your help.',
    'sorry|/ˈsɒr.i/|adjective|Feeling sad about a mistake.|क्षमस्व|I am sorry for being late.']),
  L(2, 'Family', 'People close to you.', [
    'mother|/ˈmʌð.ər/|noun|Your female parent.|आई|My mother cooks tasty food.',
    'father|/ˈfɑː.ðər/|noun|Your male parent.|वडील|My father drives to work.',
    'brother|/ˈbrʌð.ər/|noun|A boy with the same parents as you.|भाऊ|My brother plays cricket.',
    'sister|/ˈsɪs.tər/|noun|A girl with the same parents as you.|बहीण|My sister loves to sing.',
    'friend|/frend/|noun|A person you like and trust.|मित्र|My friend lives near me.']),
  L(3, 'Numbers and Colors', 'Count and describe.', [
    'one|/wʌn/|number|The number 1.|एक|I have one pen.',
    'ten|/ten/|number|The number 10.|दहा|There are ten books.',
    'red|/red/|adjective|The color of blood.|लाल|The apple is red.',
    'blue|/bluː/|adjective|The color of a clear sky.|निळा|The sky is blue.',
    'green|/ɡriːn/|adjective|The color of grass.|हिरवा|The leaves are green.']),
  L(4, 'Body Parts', 'Name parts of the body.', [
    'head|/hed/|noun|The top part of the body.|डोके|Wear a cap on your head.',
    'hand|/hænd/|noun|The part at the end of your arm.|हात|Wash your hand with soap.',
    'eye|/aɪ/|noun|The part of the body you see with.|डोळा|Dust went into my eye.',
    'nose|/nəʊz/|noun|The part of the face you smell with.|नाक|Breathe through your nose.',
    'mouth|/maʊθ/|noun|The opening you eat and speak with.|तोंड|Open your mouth wide.']),
  L(5, 'Food and Drink', 'What we eat every day.', [
    'rice|/raɪs/|noun|Small white grains cooked as food.|भात|We eat rice every day.',
    'bread|/bred/|noun|A baked food made from flour.|ब्रेड, पाव|I eat bread for breakfast.',
    'milk|/mɪlk/|noun|A white drink from cows.|दूध|Drink a glass of milk.',
    'egg|/eɡ/|noun|An oval food laid by a hen.|अंडे|She boiled an egg.',
    'water|/ˈwɔː.tər/|noun|A clear liquid we drink.|पाणी|Drink clean water daily.']),
  L(6, 'Animals', 'Pets and farm animals.', [
    'dog|/dɒɡ/|noun|A pet animal that barks.|कुत्रा|The dog runs fast.',
    'cat|/kæt/|noun|A small pet animal that purrs.|मांजर|The cat sleeps on the sofa.',
    'cow|/kaʊ/|noun|A farm animal that gives milk.|गाय|The cow gives milk.',
    'bird|/bɜːd/|noun|An animal with wings and feathers.|पक्षी|A bird sits on the tree.',
    'fish|/fɪʃ/|noun|An animal that lives in water.|मासा|The fish swims in water.']),
  L(7, 'Home', 'Things in a house.', [
    'house|/haʊs/|noun|A building where people live.|घर|Our house is big.',
    'door|/dɔːr/|noun|You open it to enter a room.|दार|Please close the door.',
    'window|/ˈwɪn.dəʊ/|noun|An opening in a wall with glass.|खिडकी|Open the window.',
    'table|/ˈteɪ.bəl/|noun|A piece of furniture with a flat top.|टेबल|The book is on the table.',
    'chair|/tʃeər/|noun|A seat for one person.|खुर्ची|Sit on the chair.']),
  L(8, 'Time', 'Parts of the day and calendar.', [
    'day|/deɪ/|noun|A period of 24 hours.|दिवस|Today is a good day.',
    'night|/naɪt/|noun|The dark time of the day.|रात्र|The night is quiet.',
    'morning|/ˈmɔː.nɪŋ/|noun|The early part of the day.|सकाळ|I wake up in the morning.',
    'week|/wiːk/|noun|A period of seven days.|आठवडा|There are seven days in a week.',
    'month|/mʌnθ/|noun|A period of about thirty days.|महिना|Next month is my birthday.']),
  L(9, 'Action Words 1', 'Everyday verbs.', [
    'eat|/iːt/|verb|To put food in your mouth and swallow.|खाणे|We eat lunch at noon.',
    'drink|/drɪŋk/|verb|To take liquid into your mouth.|पिणे|I drink tea every morning.',
    'sleep|/sliːp/|verb|To rest with your eyes closed.|झोपणे|Babies sleep a lot.',
    'walk|/wɔːk/|verb|To move on foot.|चालणे|I walk to school.',
    'run|/rʌn/|verb|To move fast on foot.|धावणे|Dogs can run fast.']),
  L(10, 'Action Words 2', 'More useful verbs.', [
    'read|/riːd/|verb|To look at words and understand them.|वाचणे|I read a book daily.',
    'write|/raɪt/|verb|To put words on paper.|लिहिणे|Write your name here.',
    'open|/ˈəʊ.pən/|verb|To move something so it is not shut.|उघडणे|Open your bag.',
    'close|/kləʊz/|verb|To shut something.|बंद करणे|Close the window, please.',
    'give|/ɡɪv/|verb|To hand something to someone.|देणे|Give me a pen.']),
  L(11, 'Describing Words', 'Size, heat and age.', [
    'big|/bɪɡ/|adjective|Large in size.|मोठा|It is a big city.',
    'small|/smɔːl/|adjective|Little in size.|लहान|I have a small bag.',
    'hot|/hɒt/|adjective|Having a high temperature.|गरम|The tea is hot.',
    'cold|/kəʊld/|adjective|Having a low temperature.|थंड|The water is cold.',
    'new|/njuː/|adjective|Not old; recently made.|नवीन|I bought a new phone.']),
  L(12, 'School', 'In the classroom.', [
    'teacher|/ˈtiː.tʃər/|noun|A person who teaches.|शिक्षक|The teacher is kind.',
    'student|/ˈstjuː.dənt/|noun|A person who studies.|विद्यार्थी|Each student has a book.',
    'book|/bʊk/|noun|Pages with words that you read.|पुस्तक|Open your book.',
    'pen|/pen/|noun|A tool for writing with ink.|पेन|I write with a pen.',
    'class|/klɑːs/|noun|A group of students taught together.|वर्ग|Our class starts at nine.']),
  L(13, 'Clothes', 'What we wear.', [
    'shirt|/ʃɜːt/|noun|Clothing for the upper body.|शर्ट|He wears a white shirt.',
    'shoes|/ʃuːz/|noun|Coverings for your feet.|बूट|Put on your shoes.',
    'cap|/kæp/|noun|A soft hat with a peak.|टोपी|I wear a cap in the sun.',
    'bag|/bæɡ/|noun|A container for carrying things.|पिशवी|My bag is heavy.',
    'dress|/dres/|noun|A one-piece garment for women.|पोशाख|She wore a red dress.']),
  L(14, 'Weather', 'Sky and seasons.', [
    'sun|/sʌn/|noun|The star that gives us light and heat.|सूर्य|The sun is bright.',
    'rain|/reɪn/|noun|Water falling from clouds.|पाऊस|I love the rain.',
    'wind|/wɪnd/|noun|Air moving outside.|वारा|The wind is strong.',
    'cloud|/klaʊd/|noun|A white or grey shape in the sky.|ढग|A dark cloud is coming.',
    'summer|/ˈsʌm.ər/|noun|The hottest season of the year.|उन्हाळा|Summer is very hot.']),
  L(15, 'Fruits and Vegetables', 'Fresh from the market.', [
    'apple|/ˈæp.əl/|noun|A round red or green fruit.|सफरचंद|An apple a day is good.',
    'banana|/bəˈnɑː.nə/|noun|A long yellow fruit.|केळे|The banana is yellow.',
    'mango|/ˈmæŋ.ɡəʊ/|noun|A sweet tropical fruit.|आंबा|I like a sweet mango.',
    'potato|/pəˈteɪ.təʊ/|noun|A round vegetable that grows underground.|बटाटा|Fry the potato.',
    'onion|/ˈʌn.jən/|noun|A vegetable with a strong smell.|कांदा|Cut the onion slowly.']),
  L(16, 'Places and Directions', 'Find your way.', [
    'market|/ˈmɑː.kɪt/|noun|A place where people buy and sell.|बाजार|We go to the market.',
    'road|/rəʊd/|noun|A path for vehicles.|रस्ता|Cross the road with care.',
    'left|/left/|adjective|The side opposite to right.|डावा|Turn left here.',
    'right|/raɪt/|adjective|The side opposite to left.|उजवा|Turn right at the shop.',
    'near|/nɪər/|adjective|Not far away.|जवळ|My school is near my house.']),
  L(17, 'Question Words', 'Ask simple questions.', [
    'what|/wɒt/|pronoun|Used to ask about a thing.|काय|What is your name?',
    'where|/weər/|adverb|Used to ask about a place.|कुठे|Where do you live?',
    'when|/wen/|adverb|Used to ask about time.|केव्हा|When does the class begin?',
    'why|/waɪ/|adverb|Used to ask for a reason.|का|Why are you late?',
    'who|/huː/|pronoun|Used to ask about a person.|कोण|Who is that boy?']),
  L(18, 'Feelings', 'Say how you feel.', [
    'happy|/ˈhæp.i/|adjective|Feeling joy.|आनंदी|I am happy today.',
    'sad|/sæd/|adjective|Feeling unhappy.|दुःखी|She looks sad.',
    'angry|/ˈæŋ.ɡri/|adjective|Feeling strong displeasure.|रागावलेला|Do not be angry.',
    'tired|/ˈtaɪ.əd/|adjective|Needing rest.|थकलेला|I am tired after work.',
    'hungry|/ˈhʌŋ.ɡri/|adjective|Wanting to eat.|भुकेलेला|The baby is hungry.']),
  L(19, 'Shopping', 'Buying and selling.', [
    'money|/ˈmʌn.i/|noun|Coins and notes used to pay.|पैसे|I have some money.',
    'price|/praɪs/|noun|The cost of something.|किंमत|What is the price?',
    'buy|/baɪ/|verb|To get something by paying.|खरेदी करणे|I want to buy a pen.',
    'sell|/sel/|verb|To give something for money.|विकणे|He will sell fruits.',
    'shop|/ʃɒp/|noun|A place that sells things.|दुकान|The shop opens at nine.']),
  L(20, 'Mixed Revision', 'Review the best of Beginner.', [
    'smile|/smaɪl/|noun|A happy look on the face.|हसू|Her smile is warm.',
    'help|/help/|verb|To make something easier for someone.|मदत करणे|Can you help me?',
    'learn|/lɜːn/|verb|To get new knowledge.|शिकणे|We learn English daily.',
    'try|/traɪ/|verb|To make an effort.|प्रयत्न करणे|Try again, you can do it.',
    'ready|/ˈred.i/|adjective|Prepared to start.|तयार|Are you ready to type?'])
];
