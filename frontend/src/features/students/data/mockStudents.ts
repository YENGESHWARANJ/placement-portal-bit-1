export interface Student {
    id: string;
    name: string;
    usn: string;
    branch: string;
    cgpa: number;
    status: "Placed" | "Unplaced" | "Offers Received";
    company?: string;
    email: string;
}

export const mockStudents: Student[] = [
    {
        id: "1",
        name: "Aravind Kumar",
        usn: "1BM20CS001",
        branch: "CSE",
        cgpa: 9.2,
        status: "Placed",
        company: "Google",
        email: "aravind@example.com",
    },
    {
        id: "2",
        name: "Sneha Reddy",
        usn: "1BM20CS045",
        branch: "CSE",
        cgpa: 8.9,
        status: "Offers Received",
        email: "sneha@example.com",
    },
    {
        id: "3",
        name: "Rahul Singh",
        usn: "1BM20EC012",
        branch: "ECE",
        cgpa: 7.5,
        status: "Unplaced",
        email: "rahul@example.com",
    },
    {
        id: "4",
        name: "Priya Sharma",
        usn: "1BM20IS023",
        branch: "ISE",
        cgpa: 8.1,
        status: "Placed",
        company: "Amazon",
        email: "priya@example.com",
    },
    {
        id: "5",
        name: "Vikram Malhotra",
        usn: "1BM20ME005",
        branch: "ME",
        cgpa: 7.2,
        status: "Unplaced",
        email: "vikram@example.com",
    },
    {
        id: "6",
        name: "Ananya Gupta",
        usn: "1BM20CS015",
        branch: "CSE",
        cgpa: 9.5,
        status: "Placed",
        company: "Microsoft",
        email: "ananya@example.com",
    },
    {
        id: "7",
        name: "Rohan Das",
        usn: "1BM20EC055",
        branch: "ECE",
        cgpa: 6.8,
        status: "Unplaced",
        email: "rohan@example.com",
    },
    {
        id: "8",
        name: "Karthik N",
        usn: "1BM20CS088",
        branch: "CSE",
        cgpa: 8.4,
        status: "Offers Received",
        company: "Accenture",
        email: "karthik@example.com",
    }
];
