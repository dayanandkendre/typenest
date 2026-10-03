// Row format: word|phonetic|part of speech|English meaning|Marathi meaning|sentence
const L = (id, name, description, rows) => ({
  id, name, description, difficulty: 'Advanced',
  words: rows.map(r => {
    const [word, phonetic, pos, en, mr, sentence] = r.split('|');
    return { word, phonetic, pos, en, mr, sentence };
  })
});

export const ADVANCED = [
  L(41, 'Daily Conversation', 'Polite phrases for real conversations.', [
    'appreciate|/əˈpriː.ʃi.eɪt/|verb|To feel grateful for something.|कदर करणे|I really appreciate your help with my application last week.',
    'postpone|/pəʊstˈpəʊn/|verb|To move an event to a later time.|पुढे ढकलणे|We had to postpone the trip because of the heavy rain.',
    'convenient|/kənˈviː.ni.ənt/|adjective|Easy and suitable for your plans.|सोयीचे|Is Saturday morning convenient for you, or should we meet later?',
    'apologize|/əˈpɒl.ə.dʒaɪz/|verb|To say sorry for a mistake.|क्षमा मागणे|I apologize for the delay; the traffic was much worse than expected.',
    'suggest|/səˈdʒest/|verb|To offer an idea for someone to consider.|सुचवणे|I suggest we leave early so that we avoid the evening rush.']),
  L(42, 'Office Basics', 'Words you hear at work every day.', [
    'deadline|/ˈded.laɪn/|noun|The last time by which work must be done.|अंतिम मुदत|Please finish the report before the deadline on Friday afternoon.',
    'colleague|/ˈkɒl.iːɡ/|noun|A person you work with.|सहकारी|My colleague helped me solve the problem in just ten minutes.',
    'schedule|/ˈʃed.juːl/|noun|A plan that lists times for tasks.|वेळापत्रक|Check the schedule to see when the manager is free.',
    'attendance|/əˈten.dəns/|noun|The fact of being present at work or school.|उपस्थिती|Regular attendance is important for every employee in this company.',
    'cabin|/ˈkæb.ɪn/|noun|A small private room in an office.|केबिन|The manager asked me to come to his cabin after lunch.']),
  L(43, 'Emails and Meetings', 'Professional communication.', [
    'agenda|/əˈdʒen.də/|noun|A list of topics to discuss in a meeting.|कार्यसूची|Please read the agenda before the meeting so that we save time.',
    'attach|/əˈtætʃ/|verb|To add a file to an email.|जोडणे|Do not forget to attach the updated file to your email.',
    'reply|/rɪˈplaɪ/|verb|To answer a message.|उत्तर देणे|Kindly reply to this message by tomorrow evening at the latest.',
    'minutes|/ˈmɪn.ɪts/|noun|A written record of what was said in a meeting.|बैठकीचे इतिवृत्त|Priya will share the minutes of the meeting with everyone today.',
    'forward|/ˈfɔː.wəd/|verb|To send a received message to someone else.|पुढे पाठवणे|Please forward this email to the entire sales team today.']),
  L(44, 'HR and Hiring', 'Joining and leaving a company.', [
    'recruit|/rɪˈkruːt/|verb|To find and hire new employees.|भरती करणे|The company plans to recruit fifty new engineers this year.',
    'vacancy|/ˈveɪ.kən.si/|noun|A job that is available.|रिक्त जागा|There is a vacancy for an accountant in our Pune branch.',
    'candidate|/ˈkæn.dɪ.dət/|noun|A person applying for a job.|उमेदवार|Each candidate must bring original documents on the day of the interview.',
    'probation|/prəˈbeɪ.ʃən/|noun|A trial period at the start of a job.|परीविक्षा|New employees stay on probation for the first six months of service.',
    'resign|/rɪˈzaɪn/|verb|To officially leave your job.|राजीनामा देणे|He decided to resign after receiving a better offer from another firm.']),
  L(45, 'Company and Management', 'How organisations are run.', [
    'manager|/ˈmæn.ɪ.dʒər/|noun|A person who leads a team or department.|व्यवस्थापक|The manager reviews the performance of every team member each quarter.',
    'department|/dɪˈpɑːt.mənt/|noun|A section of a company with a special job.|विभाग|She works in the finance department of a large manufacturing company.',
    'strategy|/ˈstræt.ə.dʒi/|noun|A long-term plan to reach a goal.|धोरण|Our new strategy focuses on rural markets and affordable products.',
    'target|/ˈtɑː.ɡɪt/|noun|A goal that you try to reach.|लक्ष्य|The team worked overtime to achieve this month\'s sales target.',
    'responsibility|/rɪˌspɒn.sɪˈbɪl.ə.ti/|noun|A duty that you must take care of.|जबाबदारी|Safety is the responsibility of every worker, not just the supervisor.']),
  L(46, 'Banking: Accounts and Cash', 'Everyday banking terms.', [
    'deposit|/dɪˈpɒz.ɪt/|verb|To put money into a bank account.|जमा करणे|You can deposit cash at any branch or through the ATM.',
    'withdraw|/wɪðˈdrɔː/|verb|To take money out of a bank account.|काढणे|Customers can withdraw up to twenty thousand rupees from the ATM daily.',
    'account|/əˈkaʊnt/|noun|An arrangement to keep your money in a bank.|खाते|I opened a savings account with a nationalised bank last month.',
    'cheque|/tʃek/|noun|A written order to a bank to pay money.|धनादेश|The cheque will be cleared within two working days.',
    'statement|/ˈsteɪt.mənt/|noun|A record of all transactions in an account.|विवरणपत्र|Download your bank statement to see all recent transactions.']),
  L(47, 'Banking: Loans and KYC', 'Interest, EMI and verification.', [
    'interest|/ˈɪn.trəst/|noun|Extra money paid for using a bank\'s money.|व्याज|The bank pays interest on your savings account every quarter.',
    'instalment|/ɪnˈstɔːl.mənt/|noun|One of several payments made over time.|हप्ता|The first instalment of the loan will be deducted on the fifth.',
    'loan|/ləʊn/|noun|Money borrowed that must be paid back.|कर्ज|She applied for a home loan to buy a flat in Nashik.',
    'collateral|/kəˈlæt.ər.əl/|noun|Property promised as security for a loan.|तारण|The bank asked for collateral before approving the business loan.',
    'verification|/ˌver.ɪ.fɪˈkeɪ.ʃən/|noun|The process of checking that something is true.|पडताळणी|KYC verification requires your Aadhaar card, PAN card and a recent photograph.']),
  L(48, 'Insurance', 'Protecting health, life and vehicles.', [
    'premium|/ˈpriː.mi.əm/|noun|The amount you pay regularly for insurance.|विमा हप्ता|You must pay the premium on time to keep your policy active.',
    'policy|/ˈpɒl.ə.si/|noun|An insurance contract.|विमा पॉलिसी|My health policy covers hospital expenses up to five lakh rupees.',
    'claim|/kleɪm/|noun|A request for money from an insurance company.|दावा|He filed a claim after the accident damaged his car.',
    'coverage|/ˈkʌv.ər.ɪdʒ/|noun|The protection an insurance plan provides.|संरक्षण|This plan offers wide coverage for surgery and medical treatment.',
    'nominee|/ˌnɒm.ɪˈniː/|noun|A person who will receive the benefit of a policy.|नामनिर्देशित व्यक्ती|Please write your wife\'s name as the nominee in the application form.']),
  L(49, 'Industrial Sector', 'Factory floor and workplace safety.', [
    'factory|/ˈfæk.tər.i/|noun|A building where goods are made.|कारखाना|More than two thousand workers are employed in this factory.',
    'machinery|/məˈʃiː.nər.i/|noun|Machines used in industry.|यंत्रसामग्री|Heavy machinery must be inspected every week to prevent accidents.',
    'shift|/ʃɪft/|noun|A fixed period of work during the day or night.|पाळी|The night shift begins at ten and ends at six in the morning.',
    'safety|/ˈseɪf.ti/|noun|Protection from danger or harm.|सुरक्षा|Wearing a helmet and gloves is part of basic safety rules.',
    'supervisor|/ˈsuː.pə.vaɪ.zər/|noun|A person who watches over workers.|पर्यवेक्षक|The supervisor checked that every worker followed the safety instructions.']),
  L(50, 'Manufacturing and Quality', 'Production, inspection and standards.', [
    'production|/prəˈdʌk.ʃən/|noun|The process of making goods.|उत्पादन|Production increased by fifteen percent after we installed the new assembly line.',
    'inspection|/ɪnˈspek.ʃən/|noun|A careful check of something.|तपासणी|Every product goes through a strict inspection before it leaves the plant.',
    'defect|/ˈdiː.fekt/|noun|A fault that spoils a product.|दोष|The workers found a small defect in the batch of steel sheets.',
    'capacity|/kəˈpæs.ə.ti/|noun|The maximum amount that can be produced.|क्षमता|The plant is working at full capacity to meet the festival demand.',
    'standard|/ˈstæn.dəd/|noun|A level of quality that is accepted as correct.|मानक|Our products meet the international quality standard for export.']),
  L(51, 'Automobile: Parts', 'Know your vehicle.', [
    'engine|/ˈen.dʒɪn/|noun|The machine that makes a vehicle move.|इंजिन|The engine of this car is smooth, quiet and very fuel efficient.',
    'brake|/breɪk/|noun|A device used to slow or stop a vehicle.|ब्रेक|Press the brake gently when you see a speed breaker ahead.',
    'tyre|/ˈtaɪ.ər/|noun|A rubber ring around a wheel.|टायर|Check the tyre pressure before you start a long highway trip.',
    'battery|/ˈbæt.ər.i/|noun|A device that stores electric power.|बॅटरी|The battery died because I left the headlights on overnight.',
    'clutch|/klʌtʃ/|noun|A pedal used to change gears.|क्लच|Press the clutch fully before you change the gear.']),
  L(52, 'Automobile: Service and Sales', 'Buying and maintaining vehicles.', [
    'service|/ˈsɜː.vɪs/|noun|Regular maintenance of a vehicle.|सर्व्हिस|Your bike is due for a service after every five thousand kilometres.',
    'mileage|/ˈmaɪ.lɪdʒ/|noun|The distance a vehicle travels on one litre of fuel.|मायलेज|This hatchback gives excellent mileage in city traffic.',
    'warranty|/ˈwɒr.ən.ti/|noun|A promise to repair a product for some time.|हमी|The warranty covers engine repairs for the first three years.',
    'showroom|/ˈʃəʊ.ruːm/|noun|A place where cars are displayed for sale.|शोरूम|We visited the showroom to take a test drive on Sunday.',
    'insurance|/ɪnˈʃɔː.rəns/|noun|Protection against loss paid for in advance.|विमा|Vehicle insurance is compulsory for every car on Indian roads.']),
  L(53, 'Logistics and Supply Chain', 'Moving goods across the country.', [
    'warehouse|/ˈweə.haʊs/|noun|A large building for storing goods.|गोदाम|The goods are stored in a warehouse near the highway.',
    'shipment|/ˈʃɪp.mənt/|noun|Goods sent together from one place to another.|माल|The shipment will reach Chennai port by the end of next week.',
    'inventory|/ˈɪn.vən.tri/|noun|The complete list of goods in stock.|साठा|We count our inventory every month to avoid shortages.',
    'delivery|/dɪˈlɪv.ər.i/|noun|The act of bringing goods to a person.|वितरण|Late delivery can upset customers and damage the reputation of a company.',
    'transport|/ˈtræn.spɔːt/|noun|The movement of people or goods.|वाहतूक|Rail transport is cheaper than road transport for heavy goods.']),
  L(54, 'IT and Software', 'Technology at work.', [
    'software|/ˈsɒft.weər/|noun|Programs that run on a computer.|सॉफ्टवेअर|The company is developing new software to manage its customer records.',
    'database|/ˈdeɪ.tə.beɪs/|noun|An organised collection of data.|डेटाबेस|All customer details are stored safely in an encrypted database.',
    'bug|/bʌɡ/|noun|An error in a computer program.|त्रुटी|The developer fixed a serious bug before releasing the update.',
    'server|/ˈsɜː.vər/|noun|A powerful computer that serves websites or data.|सर्व्हर|The website stopped working because the server crashed during the sale.',
    'backup|/ˈbæk.ʌp/|noun|A spare copy of data.|बॅकअप|Always take a backup of your important files every single week.']),
  L(55, 'Customer Service', 'Handling people and problems.', [
    'complaint|/kəmˈpleɪnt/|noun|A statement that something is not satisfactory.|तक्रार|The customer made a complaint about the late delivery of his order.',
    'refund|/ˈriː.fʌnd/|noun|Money paid back to a customer.|परतावा|You will receive a full refund within seven working days.',
    'resolve|/rɪˈzɒlv/|verb|To find a solution to a problem.|सोडवणे|Our team will resolve your issue as quickly as possible.',
    'feedback|/ˈfiːd.bæk/|noun|Comments about how good or bad something is.|अभिप्राय|We value your feedback because it helps us improve our service.',
    'satisfaction|/ˌsæt.ɪsˈfæk.ʃən/|noun|The happy feeling of getting what you wanted.|समाधान|Customer satisfaction is the main goal of every successful business.']),
  L(56, 'Sales and Marketing', 'Winning and keeping customers.', [
    'customer|/ˈkʌs.tə.mər/|noun|A person who buys goods or services.|ग्राहक|A happy customer will usually bring more customers to your shop.',
    'brand|/brænd/|noun|A name that identifies a company\'s products.|ब्रँड|This brand is popular among young people across many Indian cities.',
    'advertisement|/ədˈvɜː.tɪs.mənt/|noun|A public notice that promotes a product.|जाहिरात|The advertisement for the new scooter appeared during the cricket match.',
    'campaign|/kæmˈpeɪn/|noun|A planned set of activities to reach a goal.|मोहीम|The marketing campaign increased our online sales by thirty percent.',
    'commission|/kəˈmɪʃ.ən/|noun|Extra pay earned for each sale made.|कमिशन|Salesmen earn a commission on every product they sell each month.']),
  L(57, 'Legal and Contracts', 'Agreements and responsibilities.', [
    'contract|/ˈkɒn.trækt/|noun|A legal agreement between two parties.|करार|Both parties must sign the contract before the work begins.',
    'clause|/klɔːz/|noun|A separate section of a legal document.|कलम|The second clause explains what happens if payment is delayed.',
    'liability|/ˌlaɪ.əˈbɪl.ə.ti/|noun|Legal responsibility for something.|दायित्व|The company accepts no liability for damage caused by misuse.',
    'dispute|/dɪˈspjuːt/|noun|A serious disagreement.|वाद|They settled the dispute through a meeting instead of going to court.',
    'compliance|/kəmˈplaɪ.əns/|noun|Following rules and laws.|अनुपालन|Compliance with labour laws is mandatory for every registered company.']),
  L(58, 'Finance and Accounting', 'Numbers that run a business.', [
    'invoice|/ˈɪn.vɔɪs/|noun|A bill that lists goods sold and their price.|इनव्हॉइस|Please send the invoice to our accounts department by Monday.',
    'budget|/ˈbʌdʒ.ɪt/|noun|A plan for how money will be spent.|अंदाजपत्रक|The finance team prepared a budget for the coming financial year.',
    'profit|/ˈprɒf.ɪt/|noun|Money earned after costs are paid.|नफा|The company made a record profit despite higher raw material costs.',
    'expense|/ɪkˈspens/|noun|Money spent on something.|खर्च|Travel is the biggest expense in our monthly budget.',
    'audit|/ˈɔː.dɪt/|verb|To officially check a company\'s accounts.|लेखापरीक्षण करणे|An independent firm will audit our accounts at the end of March.']),
  L(59, 'Negotiation and Presentations', 'Speak and persuade with confidence.', [
    'negotiate|/nɪˈɡəʊ.ʃi.eɪt/|verb|To discuss in order to reach an agreement.|वाटाघाटी करणे|We need to negotiate a better price with our main supplier.',
    'proposal|/prəˈpəʊ.zəl/|noun|A formal plan or suggestion.|प्रस्ताव|The client accepted our proposal after a detailed discussion.',
    'persuade|/pəˈsweɪd/|verb|To convince someone to do or believe something.|पटवणे|A clear example can help you persuade the audience quickly.',
    'presentation|/ˌprez.ənˈteɪ.ʃən/|noun|A talk that shows ideas to an audience.|सादरीकरण|She delivered a confident presentation to the board of directors.',
    'compromise|/ˈkɒm.prə.maɪz/|noun|An agreement where each side gives up something.|तडजोड|Both sides agreed to a compromise to finish the project on time.']),
  L(60, 'Mixed Revision: Expert', 'The toughest sentences in the course.', [
    'sustainable|/səˈsteɪ.nə.bəl/|adjective|Able to continue without harming the environment.|शाश्वत|Sustainable practices help companies reduce costs and protect the environment for future generations.',
    'efficient|/ɪˈfɪʃ.ənt/|adjective|Working well without wasting time or effort.|कार्यक्षम|An efficient team completes complex projects without wasting time or resources.',
    'accountable|/əˈkaʊn.tə.bəl/|adjective|Responsible for your actions and decisions.|जबाबदार|Every manager is accountable for the decisions made within their department.',
    'comprehensive|/ˌkɒm.prɪˈhen.sɪv/|adjective|Including everything that is needed.|सर्वसमावेशक|The bank offers a comprehensive insurance plan for families, farmers and small businesses.',
    'implement|/ˈɪm.plɪ.ment/|verb|To put a plan into action.|अंमलात आणणे|The government will implement the new tax policy from the first of April.'])
];
