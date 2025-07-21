import { useState } from 'react';


const questions = [
    {
    id: 'name',
    text: 'What is your preferred name?',
    type: 'text',
    required: true
    },
    {
    id: 'number',
    text: 'Phone number (optional)',
    type: 'text',
    required: false
    },
    {
    id: 'insta',
    text: 'Instagram handle (optional)',
    type: 'text',
    required: false
    },
    {
    id: 'snap',
    text: 'Snapchat handle (optional)',
    type: 'text',
    required: false
    },
    {
        id: 'year',
        text: "What year are you entering?",
        options: [
            { label: "Freshman", value: "Freshman"},
            { label: "Sophomore", value: "Sophomore"},
            { label: "Junior", value: "Junior"},
            { label: "Senior", value: "Senior"},
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
        text: "Do you want to live in CHC Residential Area (Only open to honors students)",
        options: [
            { label: "Yes", value:true},
            { label: "No", value:false},
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
    },
    //Cleanliness Questions:
    {
        id: 'q1',
        text: "What best describes the state of your room and shared spaces?",
        options: [
            { label: "Always tidy, no clutter or trash", value: 2},
            { label: "Occasionally messy, but I clean up quickly", value: 1},
            { label: "A little messy, but still livable", value: 0},
            { label: "Often cluttered or dirty", value: -1},
            { label: "Trash, laundry, or stuff is frequently left everywhere", value: -2}
        ]
    },
    {
        id: 'q2',
        text: "How often do you clean your space?",
        options: [
            { label: "Every day", value: 2},
            { label: "Somewhat often", value: 1},
            { label: "Meh", value: 0},
            { label: "Somewhat not often", value: -1},
            { label: "Rarely if ever", value: -2}
        ]
    },
   
    {
    id: 'q3',
    text: 'Could you describe your weekly shower habits?',
    options: [
        { label: 'Twice a day or more when needed',               value:  2 },
        { label: 'About once a day',                               value:  1 },
        { label: 'Most days, but I occasionally skip',             value:  0 },
        { label: 'A few times a week depending on my schedule',    value: -1 },
        { label: "Rarely, only when I feel it's absolutely necessary", value: -2 },
    ]
    },
    {
    id: 'q4',
    text: 'How often do you eat in your dorm?',
    options: [
        { label: 'Rarely or never — I usually eat in dining areas or kitchens', value:  2 },
        { label: 'Occasionally — maybe a snack or quick meal now and then',      value:  1 },
        { label: 'About half my meals are in my dorm',                           value:  0 },
        { label: 'Most meals are eaten in my room, but I try to clean up after', value: -1 },
        { label: 'I eat in my room all the time and often leave dishes, wrappers, or crumbs behind', value: -2 },
    ]
    },
    {
    id: 'q5',
    text: 'How would you describe your oral hygiene routine?',
    options: [
        { label: 'I brush twice daily, floss regularly, and use mouthwash', value:  2 },
        { label: 'I brush twice daily and floss occasionally',                  value:  1 },
        { label: 'I usually brush once a day',                                  value:  0 },
        { label: 'I forget to brush for a day or two at times',                 value: -1 },
        { label: "I rarely brush or take care of my teeth",                    value: -2 },
    ]
    },
    {
    id: 'hobbies',
    text: 'List your top 3 hobbies (optional)', //might have to check for appropriateness
    type: 'text',
    required: false
    },
    {
    id: 'sleep_attitude',
    text: 'How would you describe your chronotype',
    options: [
        { label: 'Early bird', value:  "Early Bird"},
        { label: 'Night owl', value:  "Night Owl" },
        { label: 'Flexible', value:  "Flexible" }
    ]
    },
    {
    id: 'major',
    text: 'What is your major?', //might have to check for appropriateness
    type: 'text',
    required: true
    },
    {
    id: 'bio',
    text: 'Bio (optional)', //might have to check for appropriateness
    type: 'text',
    required: false
    }
];
export default questions;


//TODO: 1) Make it so that if user is an honors student, the website doesn't ask for their dorm ranking 2) Connect responses from frontend to groups in backend
