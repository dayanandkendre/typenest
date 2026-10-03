const w = (word, phonetic, pos, en, mr, sentence) => ({ word, phonetic, pos, en, mr, sentence });

export const LEVELS = [
  {
    id: 1, name: 'Everyday Starters', difficulty: 'Beginner',
    description: 'Short, friendly words you will use every day.',
    words: [
      w('achieve', '/əˈtʃiːv/', 'verb', 'To succeed in reaching a goal.', 'साध्य करणे', 'With daily practice, you can achieve your typing goals.'),
      w('gentle', '/ˈdʒen.təl/', 'adjective', 'Soft, kind and calm.', 'सौम्य', 'She gave the puppy a gentle pat.'),
      w('journey', '/ˈdʒɜː.ni/', 'noun', 'Travel from one place to another.', 'प्रवास', 'Every journey begins with a single step.'),
      w('bright', '/braɪt/', 'adjective', 'Full of light; or clever.', 'तेजस्वी', 'The bright morning sun filled the room.'),
      w('listen', '/ˈlɪs.ən/', 'verb', 'To pay attention to a sound.', 'ऐकणे', 'Please listen to your teacher carefully.')
    ]
  },
  {
    id: 2, name: 'Work & Study', difficulty: 'Intermediate',
    description: 'Words for classrooms, offices and interviews.',
    words: [
      w('persevere', '/ˌpɜː.sɪˈvɪər/', 'verb', 'To keep trying despite difficulty.', 'चिकाटीने प्रयत्न करणे', 'Students who persevere often reach the top.'),
      w('ambiguous', '/æmˈbɪɡ.ju.əs/', 'adjective', 'Having more than one possible meaning.', 'संदिग्ध', 'The ambiguous answer confused everyone in class.'),
      w('collaborate', '/kəˈlæb.ə.reɪt/', 'verb', 'To work together with others.', 'सहकार्य करणे', 'We collaborate with other teams to finish projects.'),
      w('resilient', '/rɪˈzɪl.i.ənt/', 'adjective', 'Able to recover quickly from trouble.', 'सावरणारा, लवचिक', 'A resilient person learns from every mistake.'),
      w('inevitable', '/ɪˈnev.ɪ.tə.bəl/', 'adjective', 'Certain to happen; unavoidable.', 'अटळ', 'Change is inevitable, so we must adapt.'),
      w('priority', '/praɪˈɒr.ə.ti/', 'noun', 'Something that is more important than others.', 'प्राधान्य', 'Your health should be your first priority.')
    ]
  },
  {
    id: 3, name: 'Advanced Lexicon', difficulty: 'Advanced',
    description: 'Rich vocabulary for essays, speeches and exams.',
    words: [
      w('ephemeral', '/ɪˈfem.ər.əl/', 'adjective', 'Lasting for a very short time.', 'क्षणभंगुर', 'Fame can be ephemeral, but skill lasts a lifetime.'),
      w('meticulous', '/məˈtɪk.jə.ləs/', 'adjective', 'Showing great attention to detail.', 'काटेकोर', 'She kept meticulous notes during every lecture.'),
      w('ubiquitous', '/juːˈbɪk.wɪ.təs/', 'adjective', 'Seeming to be everywhere at once.', 'सर्वव्यापी', 'Smartphones are ubiquitous in modern cities.'),
      w('pragmatic', '/præɡˈmæt.ɪk/', 'adjective', 'Practical rather than idealistic.', 'व्यावहारिक', 'A pragmatic approach solves problems faster.'),
      w('eloquent', '/ˈel.ə.kwənt/', 'adjective', 'Fluent and persuasive in speech.', 'वाक्पटू', 'The eloquent speaker moved the whole audience.'),
      w('substantiate', '/səbˈstæn.ʃi.eɪt/', 'verb', 'To support a claim with evidence.', 'पुराव्यानिशी सिद्ध करणे', 'You must substantiate your argument with facts.'),
      w('juxtapose', '/ˈdʒʌk.stə.pəʊz/', 'verb', 'To place two things side by side to compare.', 'शेजारी ठेवून तुलना करणे', 'The poet likes to juxtapose joy and sorrow.')
    ]
  }
];

export default LEVELS;
