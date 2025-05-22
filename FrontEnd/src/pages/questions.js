import { useState } from 'react';

const questions = [
    {
        id: 'is_freshman',
        text: "Are you a freshman?",
        options: [
            { label: "Yes", value: 'Freshman'},
            { label: "No", value: 'NF'}
        ]
    },
    {
        id: 'gender',
        text: "What is your gender?",
        options: [
            { label: "Male", value: 'male'},
            { label: "Female", value: 'female'},
        ]
    },
    {
        id: 'is_honors',
        text: "Do you want to live in CHC Residential Area (Only open to honors students",
        options: [
            { label: "Yes", value: 'H_'},
            { label: "No", value: ''},
        ]
    },
    {
        id: 'dorm1',
        text: "Which dorm is your 1st choice?",
        options: [
            { label: "Central", value: 'CE'},
            { label: "Orchard Hill", value: 'OH'},
            { label: "Northeast", value: 'NE'},
            { label: "North Apartments", value: 'No'},
            { label: "Southwest", value: 'SW'},
            { label: "Sylvan", value: 'Sy'}
        ]
    },
    {
        id: 'dorm2',
        text: "Which dorm is your 2nd choice?",
        options: [
            { label: "Central", value: 'CE'},
            { label: "Orchard Hill", value: 'OH'},
            { label: "Northeast", value: 'NE'},
            { label: "North Apartments", value: 'No'},
            { label: "Southwest", value: 'SW'},
            { label: "Sylvan", value: 'Sy'}
        ]
    },
    {
        id: 'dorm3',
        text: "Which dorm is your 3rd choice?",
        options: [
            { label: "Central", value: 'CE'},
            { label: "Orchard Hill", value: 'OH'},
            { label: "Northeast", value: 'NE'},
            { label: "North Apartments", value: 'No'},
            { label: "Southwest", value: 'SW'},
            { label: "Sylvan", value: 'Sy'}
        ]
    }
];
//TODO: 1) Make it so that if user is an honors student, the website doesn't ask for their dorm ranking 2) Connect responses from frontend to groups in backend

export default function Survey() {
    // 1) user info
    const [name, setName] = useState('');
    // answers map: { [questionId]: 'A' | 'B' | ...}
    const [answers, setAnswers] = useState(
        questions.reduce((acc, q) => ({ ...acc, [q.id]: null }), {})
    );
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleAnswer = (id, val) => {
        setAnswers(prev => ({...prev, [id]: val }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        // simple validation
        if (!name) {
            setError('Name is required');
            return;
        }
        // ensure every question has an answer
        const unanswered = Object.entries(answers)
        .filter(([_, v]) => !v)
        .map(([id]) => id);
        if (unanswered.length) {
        setError('Please answer all questions.');
        return;
        }

        //try catch block
        
    }
}