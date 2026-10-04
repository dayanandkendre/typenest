// Row format: word|phonetic|part of speech|English meaning|Marathi meaning|sentence
const L = (id, name, description, rows) => ({
  id, name, description, difficulty: 'Intermediate',
  words: rows.map(r => {
    const [word, phonetic, pos, en, mr, sentence] = r.split('|');
    return { word, phonetic, pos, en, mr, sentence };
  })
});

export const INTERMEDIATE = [
  L(21, 'Railway and Bus Travel', 'Words for trains, buses and stations.', [
    'platform|/ˈplæt.fɔːm/|noun|The raised area where passengers wait for a train.|फलाट|The train will arrive on platform number two.',
    'ticket|/ˈtɪk.ɪt/|noun|A paper or message that allows you to travel.|तिकीट|Please book your train ticket before the festival rush.',
    'passenger|/ˈpæs.ɪn.dʒər/|noun|A person travelling in a vehicle.|प्रवासी|Every passenger must show a valid ticket to the checker.',
    'station|/ˈsteɪ.ʃən/|noun|A place where trains or buses stop.|स्थानक|We reached Pune station early in the morning.',
    'luggage|/ˈlʌɡ.ɪdʒ/|noun|Bags and cases you carry when you travel.|सामान|Keep your luggage near you in the crowded compartment.']),
  L(22, 'Market and Bhaji Mandi', 'Buying and selling at the local market.', [
    'vendor|/ˈven.dər/|noun|A person who sells things, often outdoors.|विक्रेता|The vendor sells fresh vegetables near the temple.',
    'bargain|/ˈbɑː.ɡɪn/|verb|To discuss a lower price with a seller.|घासाघीस करणे|We always bargain politely at the weekly market.',
    'fresh|/freʃ/|adjective|Recently made or picked; not old.|ताजे|Mother buys fresh coriander from the market every day.',
    'kilo|/ˈkiː.ləʊ/|noun|A unit of weight equal to 1000 grams.|किलो|Please give me one kilo of tomatoes.',
    'discount|/ˈdɪs.kaʊnt/|noun|A reduction in the price.|सूट|The shopkeeper gave us a discount on the festival sale.']),
  L(23, 'Festivals', 'Celebrations across India.', [
    'festival|/ˈfes.tɪ.vəl/|noun|A special day or time of celebration.|सण|Diwali is the festival of lights in India.',
    'celebrate|/ˈsel.ə.breɪt/|verb|To enjoy a special day with joy.|साजरा करणे|Families celebrate Ganpati with music, sweets and prayers.',
    'sweets|/swiːts/|noun|Sugary foods such as ladoo and barfi.|मिठाई|We share sweets with our neighbours on Diwali.',
    'decorate|/ˈdek.ə.reɪt/|verb|To make a place look beautiful.|सजवणे|Children decorate the house with colourful lamps and flowers.',
    'tradition|/trəˈdɪʃ.ən/|noun|A custom passed down over many years.|परंपरा|Visiting relatives is an old tradition in our family.']),
  L(24, 'Cricket', 'The game India loves most.', [
    'bowler|/ˈbəʊ.lər/|noun|A player who throws the ball to the batsman.|गोलंदाज|The fast bowler took three wickets in one over.',
    'batsman|/ˈbæt.smən/|noun|A player who hits the ball with a bat.|फलंदाज|The batsman hit a six and the crowd cheered.',
    'wicket|/ˈwɪk.ɪt/|noun|The three stumps; also a batsman getting out.|बळी|Our team lost the first wicket in the second over.',
    'captain|/ˈkæp.tɪn/|noun|The leader of a team.|कर्णधार|The captain won the toss and chose to bat.',
    'tournament|/ˈtʊə.nə.mənt/|noun|A series of matches to find a winner.|स्पर्धा|Our college team won the cricket tournament this year.']),
  L(25, 'Chai and Indian Food', 'Everyday food and flavours.', [
    'chai|/tʃaɪ/|noun|Indian tea made with milk and spices.|चहा|A cup of hot chai makes the rainy evening better.',
    'spicy|/ˈspaɪ.si/|adjective|Having a strong, hot taste.|तिखट|This misal is too spicy for my little brother.',
    'curry|/ˈkʌr.i/|noun|A dish cooked in a sauce with spices.|रस्सा, भाजी|Mother made a vegetable curry with fresh coriander.',
    'breakfast|/ˈbrek.fəst/|noun|The first meal of the day.|नाश्ता|Poha is a popular breakfast in Maharashtra.',
    'recipe|/ˈres.ɪ.pi/|noun|Instructions for cooking a dish.|कृती|My grandmother shared her recipe for puran poli.']),
  L(26, 'School and College', 'Studies, exams and admissions.', [
    'exam|/ɪɡˈzæm/|noun|A formal test of knowledge.|परीक्षा|I have a maths exam on Monday morning.',
    'admission|/ədˈmɪʃ.ən/|noun|Permission to join a school or college.|प्रवेश|She took admission in a good engineering college.',
    'syllabus|/ˈsɪl.ə.bəs/|noun|The list of topics in a course.|अभ्यासक्रम|The teacher explained the new syllabus to the class.',
    'assignment|/əˈsaɪn.mənt/|noun|Work given to a student to complete.|स्वाध्याय|Submit your English assignment before Friday evening.',
    'scholarship|/ˈskɒl.ə.ʃɪp/|noun|Money given to a student to pay for studies.|शिष्यवृत्ती|He received a scholarship for his excellent marks.']),
  L(27, 'UPI and Mobile Recharge', 'Digital payments in daily life.', [
    'payment|/ˈpeɪ.mənt/|noun|The act of paying money.|देयक, पेमेंट|Your UPI payment was successful.',
    'recharge|/ˌriːˈtʃɑːdʒ/|verb|To add money or power to a phone.|रिचार्ज करणे|I need to recharge my mobile plan today.',
    'balance|/ˈbæl.əns/|noun|The money left in an account.|शिल्लक|Please check your bank balance before you pay.',
    'scan|/skæn/|verb|To read a code using a camera.|स्कॅन करणे|Scan the QR code to pay the shopkeeper.',
    'transaction|/trænˈzæk.ʃən/|noun|An act of buying, selling or sending money.|व्यवहार|The transaction failed because of a weak network.']),
  L(28, 'Rickshaw and Traffic', 'Roads, vehicles and rules.', [
    'rickshaw|/ˈrɪk.ʃɔː/|noun|A small three-wheeled taxi.|रिक्षा|The rickshaw driver took us to the railway station.',
    'traffic|/ˈtræf.ɪk/|noun|Vehicles moving on a road.|वाहतूक|Heavy traffic on the highway made us late.',
    'signal|/ˈsɪɡ.nəl/|noun|A light that tells vehicles to stop or go.|सिग्नल|Stop your vehicle when the signal turns red.',
    'helmet|/ˈhel.mɪt/|noun|A hard hat that protects your head.|हेल्मेट|Always wear a helmet while riding a motorcycle.',
    'fare|/feər/|noun|The money you pay for a journey.|भाडे|What is the fare to the bus stand?']),
  L(29, 'Hospital and Doctor', 'Health words you may need.', [
    'doctor|/ˈdɒk.tər/|noun|A person trained to treat illness.|डॉक्टर|The doctor advised her to rest for three days.',
    'medicine|/ˈmed.ɪ.sən/|noun|A substance taken to treat illness.|औषध|Take this medicine twice a day after food.',
    'fever|/ˈfiː.vər/|noun|A body temperature higher than normal.|ताप|My son has a fever since last night.',
    'appointment|/əˈpɔɪnt.mənt/|noun|A planned time to meet someone.|भेटीची वेळ|I booked an appointment with the dentist for Saturday.',
    'prescription|/prɪˈskrɪp.ʃən/|noun|A doctor\'s written order for medicine.|डॉक्टरांची चिठ्ठी|The chemist asked for the doctor\'s prescription.']),
  L(30, 'Village and City', 'Compare two ways of life.', [
    'village|/ˈvɪl.ɪdʒ/|noun|A small community in the countryside.|गाव|My grandparents live in a small village near Satara.',
    'city|/ˈsɪt.i/|noun|A large and important town.|शहर|Life in a big city is very fast.',
    'crowded|/ˈkraʊ.dɪd/|adjective|Full of people.|गर्दीचा|The local train is crowded in the morning.',
    'peaceful|/ˈpiːs.fəl/|adjective|Calm and quiet.|शांत|The village is peaceful and full of green fields.',
    'population|/ˌpɒp.jəˈleɪ.ʃən/|noun|The number of people living in a place.|लोकसंख्या|The population of Mumbai grows every year.']),
  L(31, 'Monsoon and Farming', 'Rain, fields and crops.', [
    'monsoon|/mɒnˈsuːn/|noun|The rainy season in India.|मान्सून|The monsoon reaches Maharashtra in the month of June.',
    'farmer|/ˈfɑː.mər/|noun|A person who grows crops.|शेतकरी|The farmer wakes up before sunrise to work.',
    'harvest|/ˈhɑː.vɪst/|verb|To gather a crop when it is ready.|कापणी करणे|Farmers harvest wheat in the month of March.',
    'crop|/krɒp/|noun|A plant grown for food.|पीक|Heavy rain can damage the standing crop.',
    'irrigation|/ˌɪr.ɪˈɡeɪ.ʃən/|noun|Supplying water to farmland.|सिंचन|Good irrigation helps farmers grow crops in summer.']),
  L(32, 'Wedding and Functions', 'Family celebrations.', [
    'wedding|/ˈwed.ɪŋ/|noun|A ceremony where two people get married.|लग्न|We are going to my cousin\'s wedding on Sunday.',
    'invitation|/ˌɪn.vɪˈteɪ.ʃən/|noun|A request to come to an event.|निमंत्रण|She sent a beautiful invitation to all her relatives.',
    'guest|/ɡest/|noun|A person invited to an event or home.|पाहुणा|Every guest received a gift at the function.',
    'blessing|/ˈbles.ɪŋ/|noun|Good wishes given by elders.|आशीर्वाद|The couple took blessings from the elders.',
    'ceremony|/ˈser.ɪ.mə.ni/|noun|A formal event with special customs.|समारंभ|The wedding ceremony begins at ten in the morning.']),
  L(33, 'Government Offices', 'Forms, queues and certificates.', [
    'certificate|/səˈtɪf.ɪ.kət/|noun|An official paper that proves something.|प्रमाणपत्र|You need a birth certificate for school admission.',
    'application|/ˌæp.lɪˈkeɪ.ʃən/|noun|A formal request, usually written.|अर्ज|Submit the application at the counter before noon.',
    'document|/ˈdɒk.jə.mənt/|noun|An official paper with information.|कागदपत्र|Carry every original document to the office.',
    'queue|/kjuː/|noun|A line of people waiting for their turn.|रांग|Please stand in the queue and wait for your turn.',
    'signature|/ˈsɪɡ.nə.tʃər/|noun|Your name written in your own style.|सही|The officer asked for my signature on the form.']),
  L(34, 'Phone and Internet', 'Staying connected.', [
    'network|/ˈnet.wɜːk/|noun|The signal that connects your phone.|नेटवर्क|There is no network in this part of the village.',
    'download|/ˌdaʊnˈləʊd/|verb|To copy a file or app to your phone.|डाउनलोड करणे|Download the app and create your account.',
    'password|/ˈpɑːs.wɜːd/|noun|A secret word that protects your account.|पासवर्ड|Never share your password with anyone.',
    'message|/ˈmes.ɪdʒ/|noun|Written words sent to someone.|संदेश|I sent you a message on WhatsApp.',
    'screen|/skriːn/|noun|The flat display of a phone or computer.|पडदा|The screen of my phone cracked yesterday.']),
  L(35, 'Neighbours and Society', 'Life in a housing society.', [
    'neighbour|/ˈneɪ.bər/|noun|A person who lives near you.|शेजारी|Our neighbour always greets us with a smile.',
    'society|/səˈsaɪ.ə.ti/|noun|A group that manages a housing complex.|सोसायटी|The society meeting starts at seven in the evening.',
    'parking|/ˈpɑː.kɪŋ/|noun|A place to leave your vehicle.|पार्किंग|Please do not block the parking area.',
    'watchman|/ˈwɒtʃ.mən/|noun|A person who guards a building.|चौकीदार|The watchman opens the gate for every visitor.',
    'maintenance|/ˈmeɪn.tə.nəns/|noun|Money paid to keep a building in good condition.|देखभाल खर्च|We pay society maintenance on the first of every month.']),
  L(36, 'Job Interview Basics', 'First steps to a new job.', [
    'interview|/ˈɪn.tə.vjuː/|noun|A formal meeting to check if you suit a job.|मुलाखत|I have a job interview tomorrow morning.',
    'resume|/ˈrez.ə.meɪ/|noun|A document listing your education and work.|बायोडाटा|Please bring a printed copy of your resume.',
    'experience|/ɪkˈspɪə.ri.əns/|noun|Knowledge gained from doing a job.|अनुभव|She has two years of experience in sales.',
    'salary|/ˈsæl.ər.i/|noun|Money paid to you for work every month.|पगार|The company will discuss your salary after the interview.',
    'confident|/ˈkɒn.fɪ.dənt/|adjective|Sure about your own ability.|आत्मविश्वासू|Stay calm and confident during the interview.']),
  L(37, 'Electricity and Water Bill', 'Household services.', [
    'electricity|/ɪˌlekˈtrɪs.ə.ti/|noun|Power used for lights and machines.|वीज|We pay the electricity bill every month.',
    'meter|/ˈmiː.tər/|noun|A device that measures how much you use.|मीटर|The officer came to read the meter.',
    'supply|/səˈplaɪ/|noun|The act of providing something, such as water.|पुरवठा|Water supply will stop tomorrow for repair work.',
    'bill|/bɪl/|noun|A paper that shows how much money you owe.|बिल|The bill is higher this month because of the heat.',
    'tank|/tæŋk/|noun|A large container for water.|टाकी|The water tank on our roof is full.']),
  L(38, 'Movies and Music', 'Entertainment in India.', [
    'movie|/ˈmuː.vi/|noun|A story shown on a screen.|चित्रपट|We watched a Marathi movie last Sunday.',
    'actor|/ˈæk.tər/|noun|A person who plays a role in a film.|अभिनेता|My favourite actor works in many Hindi films.',
    'song|/sɒŋ/|noun|Words set to music.|गाणे|This song plays at every wedding in India.',
    'theatre|/ˈθɪə.tər/|noun|A place where films or plays are shown.|चित्रपटगृह|The theatre was full on the first day.',
    'concert|/ˈkɒn.sət/|noun|A live music show.|संगीत कार्यक्रम|Many people came to the concert in the park.']),
  L(39, 'Rent and Finding a House', 'Looking for a place to live.', [
    'rent|/rent/|noun|Money paid regularly to use a house.|भाडे|The monthly rent of this flat is fifteen thousand rupees.',
    'landlord|/ˈlænd.lɔːd/|noun|The owner of a rented house.|घरमालक|Our landlord lives on the ground floor.',
    'flat|/flæt/|noun|A home on one floor of a building.|सदनिका|We are looking for a two-bedroom flat near my office.',
    'deposit|/dɪˈpɒz.ɪt/|noun|Money paid in advance and returned later.|अनामत रक्कम|You must pay a deposit before you move in.',
    'agreement|/əˈɡriː.mənt/|noun|A written deal between two people.|करार|Read the rent agreement carefully before you sign.']),
  L(40, 'Mixed Revision', 'Review the best of Intermediate.', [
    'important|/ɪmˈpɔː.tənt/|adjective|Having great value or meaning.|महत्त्वाचे|It is important to reach the station on time.',
    'expensive|/ɪkˈspen.sɪv/|adjective|Costing a lot of money.|महाग|Petrol has become very expensive this year.',
    'cheap|/tʃiːp/|adjective|Low in price.|स्वस्त|Vegetables are cheap in the morning market.',
    'nearby|/ˌnɪəˈbaɪ/|adjective|Not far away.|जवळपासचे|There is a good hospital nearby.',
    'reach|/riːtʃ/|verb|To arrive at a place.|पोहोचणे|We will reach home before it starts to rain.'])
];
