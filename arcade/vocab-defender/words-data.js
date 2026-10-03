export const TIERS=[['Novice Warmup',1,5],['Fluent Explorer',6,10],['Speed Tactician',11,15],['Exam Hall Specialist',16,20],['Grandmaster Blitz',21,25]];
const sets=[
[['book','पुस्तक'],['time','वेळ'],['work','काम'],['read','वाचणे'],['learn','शिकणे'],['good','चांगले'],['help','मदत'],['home','घर']],
[['word','शब्द'],['name','नाव'],['task','कार्य'],['plan','योजना'],['fast','जलद'],['slow','हळू'],['kind','दयाळू'],['true','खरे']],
[['game','खेळ'],['team','संघ'],['goal','ध्येय'],['idea','कल्पना'],['mind','मन'],['skill','कौशल्य'],['focus','एकाग्रता'],['grow','वाढणे']],
[['learn','शिकणे'],['write','लिहिणे'],['speak','बोलणे'],['build','बांधणे'],['solve','सोडवणे'],['trust','विश्वास'],['clear','स्पष्ट'],['smart','हुशार']],
[['daily','दररोजचे'],['ready','तयार'],['right','योग्य'],['value','मूल्य'],['power','शक्ती'],['voice','आवाज'],['world','जग'],['dream','स्वप्न']],
[['school','शाळा'],['office','कार्यालय'],['family','कुटुंब'],['friend','मित्र'],['market','बाजार'],['health','आरोग्य'],['travel','प्रवास'],['simple','सोपे']],
[['people','लोक'],['public','सार्वजनिक'],['future','भविष्य'],['system','प्रणाली'],['career','कारकीर्द'],['result','निकाल'],['reason','कारण'],['change','बदल']],
[['answer','उत्तर'],['lesson','धडा'],['method','पद्धत'],['number','संख्या'],['subject','विषय'],['letter','अक्षर'],['memory','स्मरणशक्ती'],['energy','ऊर्जा']],
[['market','बाजार'],['service','सेवा'],['support','आधार'],['project','प्रकल्प'],['design','रचना'],['report','अहवाल'],['meeting','बैठक'],['success','यश']],
[['career','कारकीर्द'],['business','व्यवसाय'],['finance','अर्थव्यवस्था'],['customer','ग्राहक'],['quality','गुणवत्ता'],['process','प्रक्रिया'],['product','उत्पादन'],['growth','वाढ']],
[['analysis','विश्लेषण'],['strategy','धोरण'],['research','संशोधन'],['academic','शैक्षणिक'],['critical','गंभीर'],['concept','संकल्पना'],['evidence','पुरावा'],['logical','तार्किक']],
[['document','दस्तऐवज'],['deadline','अंतिम मुदत'],['feedback','अभिप्राय'],['workflow','कामाची पद्धत'],['priority','प्राधान्य'],['resource','संसाधन'],['meeting','बैठक'],['network','जाळे']],
[['efficient','कार्यक्षम'],['accurate','अचूक'],['creative','सर्जनशील'],['reliable','विश्वसनीय'],['strategy','धोरण'],['solution','उपाय'],['progress','प्रगती'],['decision','निर्णय']],
[['leadership','नेतृत्व'],['communication','संवाद'],['innovation','नवोन्मेष'],['performance','कामगिरी'],['knowledge','ज्ञान'],['management','व्यवस्थापन'],['training','प्रशिक्षण'],['analysis','विश्लेषण']],
[['productivity','उत्पादकता'],['professional','व्यावसायिक'],['development','विकास'],['opportunity','संधी'],['technology','तंत्रज्ञान'],['competitive','स्पर्धात्मक'],['organization','संस्था'],['responsibility','जबाबदारी']],
[['abundant','मुबलक'],['adequate','पुरेसे'],['beneficial','फायदेशीर'],['coherent','सुसंगत'],['consistent','सातत्यपूर्ण'],['credible','विश्वसनीय'],['diligent','मेहनती'],['eligible','पात्र']],
[['essential','आवश्यक'],['feasible','व्यवहार्य'],['frequent','वारंवार'],['fundamental','मूलभूत'],['impartial','निष्पक्ष'],['inevitable','अपरिहार्य'],['notable','लक्षणीय'],['precise','अचूक']],
[['prosperity','समृद्धी'],['rational','तर्कसंगत'],['relevant','संबंधित'],['resilient','लवचिक'],['significant','महत्त्वपूर्ण'],['substantial','लक्षणीय'],['transparent','पारदर्शक'],['versatile','बहुगुणी']],
[['acquisition','अधिग्रहण'],['assessment','मूल्यांकन'],['compliance','अनुपालन'],['consequence','परिणाम'],['constitution','राज्यघटना'],['demographic','लोकसंख्याशास्त्रीय'],['legislation','कायदेविषयक प्रक्रिया'],['regulation','नियमन']],
[['administration','प्रशासन'],['agriculture','शेती'],['amendment','दुरुस्ती'],['bureaucracy','नोकरशाही'],['economical','किफायतशीर'],['infrastructure','पायाभूत सुविधा'],['jurisdiction','अधिकारक्षेत्र'],['reconciliation','समेट']],
[['accelerate','वेग वाढवणे'],['adaptation','अनुकूलन'],['anticipate','अंदाज करणे'],['collaboration','सहकार्य'],['determination','दृढनिश्चय'],['entrepreneur','उद्योजक'],['implementation','अंमलबजावणी'],['transformation','परिवर्तन']],
[['accountability','उत्तरदायित्व'],['discrimination','भेदभाव'],['environmental','पर्यावरणीय'],['interpretation','अर्थलावणी'],['negotiation','वाटाघाटी'],['perspective','दृष्टीकोन'],['sustainability','शाश्वतता'],['verification','पडताळणी']],
[['confidentiality','गोपनीयता'],['constitutional','घटनात्मक'],['contemporary','समकालीन'],['controversial','वादग्रस्त'],['entrepreneurial','उद्योजकीय'],['multilateral','बहुपक्षीय'],['prioritization','प्राधान्यक्रम ठरवणे'],['technological','तांत्रिक']],
[['bureaucratic','नोकरशाहीशी संबंधित'],['comprehensive','सर्वसमावेशक'],['discretionary','विवेकाधीन'],['extraordinary','असामान्य'],['institutional','संस्थात्मक'],['jurisprudence','न्यायशास्त्र'],['methodology','कार्यपद्धती'],['unprecedented','अभूतपूर्व']],
[['electromagnetic','विद्युतचुंबकीय'],['interdisciplinary','आंतरशाखीय'],['misinterpretation','चुकीचा अर्थ'],['multidimensional','बहुआयामी'],['professionalism','व्यावसायिकता'],['responsiveness','प्रतिसादक्षमता'],['synchronization','समकालिकीकरण'],['transformation','परिवर्तन']]
];
export const LEVELS=sets.map((words,i)=>({id:i+1,tier:Math.floor(i/5)+1,title:['First Steps','Clean Start','Quick Fingers','Word Scout','Warmup Complete','Daily English','Everyday Explorer','Study Run','Office Route','Fluent Path','Analysis Gate','Strategy Grid','Precision Lab','Decision Room','Speed Scholar','Exam Vocabulary I','Exam Vocabulary II','Exam Vocabulary III','Rank Booster','Exam Master','Blitz Initiate','Swarm Commander','Red Alert','Grandmaster Trial','Word Defender Boss'][i],target:8+(i>=5?2:0)+(i>=10?1:0),active:i<5?1:i<10?2:i<20?3:4,interval:Math.max(.55,1.55-i*.04),speed:.035+i*.0025,boss:i===19||i===24,words:words.map(([word,meaning])=>({word,meaning}))}));
