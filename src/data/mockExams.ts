import { ExamStatus } from '../types';

export interface MockExam {
  id: string;
  no: number;
  regNo: string;
  district: string;
  date: string;
  fee: number;
  candidatesCount: number;
  subject: string;
  updated: string;
  status: ExamStatus;
  organization: string;
  unitName: string;
  category: string;
  courseStart: string;
  courseEnd: string;
  examDate: string;
  deadline: string;
  address: string;
  candidates: any[];
  attachment?: {
    name: string;
    size: string;
    url?: string;
  };
}

export const mockExams: MockExam[] = [
  {
    id: '1',
    no: 1,
    regNo: 'BTU/2016/0009',
    district: 'BINTULU',
    date: '2016-11-18',
    fee: 4.00,
    candidatesCount: 2,
    subject: '800/2 - Pertolongan Cemas Asas dan CPR',
    updated: 'Ya',
    status: ExamStatus.EXPIRED,
    organization: 'Sekolah SAINS',
    unitName: 'Sekolah SAINS',
    category: 'Private',
    courseStart: '23/11/2016',
    courseEnd: '23/11/2016',
    examDate: '18/11/2016',
    deadline: '28/11/2017',
    address: 'Sekolah SAINS',
    candidates: [
      { id: 'c1', name: 'DORY THE FISH', idNo: 'K099012', membershipNo: '123441', isMember: true, attendance: { theory: false, oral: false, practical: false } },
      { id: 'c2', name: 'FELIX THE CAT', idNo: 'K090012', membershipNo: '123442', isMember: true, attendance: { theory: false, oral: false, practical: false } },
    ]
  },
  {
    id: '2',
    no: 2,
    regNo: 'KCH/2024/0042',
    district: 'KUCHING',
    date: '2024-03-12',
    fee: 15.00,
    candidatesCount: 10,
    subject: '700/1 - Pertolongan Cemas Asas',
    updated: 'Ya',
    status: ExamStatus.PENDING_VERIFICATION,
    organization: 'Malaysian Red Crescent Society',
    unitName: 'Unit Kuching 01',
    category: 'NGO',
    courseStart: '10/03/2024',
    courseEnd: '11/03/2024',
    examDate: '12/03/2024',
    deadline: '19/03/2024',
    address: 'HQ Kuching',
    candidates: [
      { id: 'c1', name: 'AHMAD BIN ALI', idNo: '950101-13-5555', membershipNo: 'S-12345', isMember: true, attendance: { theory: true, oral: true, practical: true } },
    ]
  },
  {
    id: '4',
    no: 4,
    regNo: 'SIU/2024/0088',
    district: 'SIBU',
    date: '2024-05-15',
    fee: 50.00,
    candidatesCount: 20,
    subject: '700/2 - Rawatan Asas',
    updated: 'Ya',
    status: ExamStatus.APPROVED,
    organization: 'SMK Sibu',
    unitName: 'Unit Sibu 02',
    category: 'Government',
    courseStart: '13/05/2024',
    courseEnd: '14/05/2024',
    examDate: '15/05/2024',
    deadline: '22/05/2024',
    address: 'Dewan Sekolah',
    candidates: [
      { id: 'c1', name: 'ALEX WONG', idNo: '980101-13-1111', membershipNo: 'S-9999', isMember: true, attendance: { theory: true, oral: true, practical: true } },
    ]
  },
  {
    id: '5',
    no: 5,
    regNo: 'BTU/2024/0112',
    district: 'BINTULU',
    date: '2024-06-10',
    fee: 25.00,
    candidatesCount: 15,
    subject: '800/1 - Pertolongan Cemas Asas',
    updated: 'Tidak',
    status: ExamStatus.APPROVED,
    organization: 'Bintulu Jaya Poly',
    unitName: 'Unit Poly 01',
    category: 'VAD',
    courseStart: '08/06/2024',
    courseEnd: '09/06/2024',
    examDate: '10/06/2024',
    deadline: '17/06/2024',
    address: 'Dewan Serbaguna Poly',
    candidates: [
      { id: 'c1', name: 'ZULKIFLI BIN HASSAN', idNo: '900505-13-1234', membershipNo: 'B-1122', isMember: true, attendance: { theory: true, oral: true, practical: true } },
    ]
  },
  {
    id: '6',
    no: 6,
    regNo: 'MIRI/2024/0099',
    district: 'MIRI',
    date: '2024-07-05',
    fee: 30.00,
    candidatesCount: 8,
    subject: '700/1 - Pertolongan Cemas Asas',
    updated: 'Ya',
    status: ExamStatus.APPROVED,
    organization: 'Curtin University',
    unitName: 'Curtin Unit 05',
    category: 'Private',
    courseStart: '03/07/2024',
    courseEnd: '04/07/2024',
    examDate: '05/07/2024',
    deadline: '12/07/2024',
    address: 'Lecture Theatre 3',
    candidates: [
      { id: 'c1', name: 'SARAH JANE', idNo: '951212-13-4321', membershipNo: 'M-5544', isMember: true, attendance: { theory: true, oral: true, practical: true } },
    ]
  }
];
