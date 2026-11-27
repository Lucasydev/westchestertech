const posts = [
  {
    id: 'westchester-hackathon', category: 'hackathon', title: 'Westchester Hackathon',
    summary: 'A countywide build day for high school students is taking shape. Help bring the first edition to life.',
    image: '', imageAlt: '', meta: 'In the works', place: 'Countywide', icon: 'flag',
    intro: 'The idea is simple. Bring high school builders from across Westchester into one space, form teams, and make something worth sharing.',
    details: [['Status', 'In planning. The date and venue are still open.'], ['Who can get involved', 'Westchester high school students, school clubs, mentors, and local sponsors.'], ['Ways to help', 'Bring a team, suggest a venue, coach first-time builders, or contribute equipment.']],
    action: 'Join the interest list', formRole: 'hackathon'
  },
  {
    id: 'onshape-boat-challenge', category: 'events', title: 'Onshape Boat Challenge',
    summary: 'Design a boat in CAD, then race your 3D-printed build with the Scarsdale Robo Raiders.',
    image: '', imageAlt: '', meta: 'Dec 15 & 19, 2026', place: 'Tuckahoe', icon: 'calendar',
    intro: 'The Scarsdale Robo Raiders lead this two-part workshop at Tuckahoe Public Library. Learn Onshape in the first session, then assemble and race your printed boat in the second.',
    details: [['When', 'Tuesday, December 15 and Saturday, December 19, 2026. Both sessions start at 3:45 pm ET.'], ['Where', 'Tuckahoe Public Library, 71 Columbus Avenue, Tuckahoe.'], ['Before you go', 'For tweens and teens ages 10 and up. Register with the library, bring a laptop, and plan to attend both dates.']],
    url: 'https://tuckahoelibrary.libcal.com/event/17883432', action: 'Visit the event page'
  },
  {
    id: 'bitview', category: 'innovations', title: 'BitView, built in Ardsley',
    summary: 'Three students turned their internship interviews into an idea for a browser-based video app.',
    image: '', imageAlt: '', meta: 'Student project', place: 'Ardsley', icon: 'code',
    intro: 'After applying for internships and summer programs, Saihajbir Singh, Griffin Chan, and Ishan Gheewala wanted a simpler way to join a video interview. The Ardsley High School team built BitView so interviewers and applicants can meet directly in a browser.',
    details: [['What they built', 'A web app for hosting live video interviews.'], ['Recognition', 'Winner of the 2025 Congressional App Challenge for New York’s 16th District, announced January 20, 2026.']],
    url: 'https://www.congressionalappchallenge.us/25-ny16/', action: 'Read the project story'
  },
  {
    id: '3d-pen-night', category: 'events', title: '3D Pen Night', summary: 'Take a drawing off the page with a 3D pen in the library’s Teen Room.',
    image: '', imageAlt: '', meta: 'Nov 30, 2026', place: 'New Rochelle', icon: 'calendar',
    intro: 'Make a small sculpture or build a gift with the library’s 3D pens. Ask the Teen Room staff about the 3D printer while you’re there.',
    details: [['When', 'Monday, November 30, 2026, 3:00 to 8:00 pm ET.'], ['Where', 'Teen Room, New Rochelle Public Library, 1 Library Plaza.'], ['Who can attend', 'Students in grades 6 through 12.']],
    url: 'https://www.newrochellelibrary.org/event/3d-pen-night-76547', action: 'Visit the event page'
  },
  {
    id: 'scarsdale-robo-raiders', category: 'clubs', title: 'Scarsdale Robo Raiders', summary: 'Meet the Scarsdale High School students designing and programming competition robots.',
    image: '', imageAlt: '', meta: 'Robotics team', place: 'Scarsdale', icon: 'users',
    intro: 'The Robo Raiders build robots for the FIRST Tech Challenge. Their work extends beyond competition through student-led workshops in the community.',
    details: [['School', 'Scarsdale High School'], ['Explore', 'Visit the team site to see its robots, competition work, and outreach.']],
    url: 'https://www.scarsdalerobotics.com/', action: 'Visit the team website'
  },
  {
    id: 'surgery-video', category: 'innovations', title: 'An AI editor for surgical footage', summary: 'A Byram Hills student found a way to cut hours of irrelevant footage from surgery recordings.',
    image: '', imageAlt: '', meta: 'Student project', place: 'Armonk', icon: 'code',
    intro: 'Byram Hills student Gavin Bunting designed a tool that identifies irrelevant sections of robotic surgery videos. A shorter recording gives researchers and educators less material to sift through.',
    details: [['Field', 'Computer vision and surgical education'], ['Recognition', 'The work received a patent award at a national inventor competition.']],
    url: 'https://www.byramhills.org/bhhs-posts/~board/bhhs-news/post/byram-hills-senior-gavin-bunting-wins-patent-award-at-national-inventor-competition', action: 'Read the school’s story'
  },
  {
    id: 'open-maker', category: 'events', title: 'Open Maker', summary: 'Reserve a machine for an evening at the Scarsdale Public Library Makerspace.',
    image: '', imageAlt: '', meta: 'Dec 9, 2026', place: 'Scarsdale', icon: 'calendar',
    intro: 'Work on a hands-on project using the makerspace’s Glowforge, Cricut, sewing machine, embroidery machine, or button maker.',
    details: [['When', 'Wednesday, December 9, 2026, 5:00 to 8:00 pm ET.'], ['Where', 'Scarsdale Public Library Makerspace, 54 Olmsted Road.'], ['Who can attend', 'Scarsdale residents, including teens. A machine reservation is required.']],
    url: 'https://www.scarsdalelibrary.org/event/open-maker-165091', action: 'View reservations'
  },
  {
    id: 'byram-hills-tech', category: 'clubs', title: 'Byram Hills Tech Club', summary: 'Custom PC builds, programming, 3D modeling, and mechanical keyboards in Armonk.',
    image: '', imageAlt: '', meta: 'School club', place: 'Armonk', icon: 'users',
    intro: 'Byram Hills students get hands-on with tech, from assembling custom PCs to exploring keyboards, code, and 3D design.',
    details: [['School', 'Byram Hills High School'], ['How to connect', 'Byram Hills students can ask club adviser Mr. Lewick about the next meeting.']],
    url: 'https://www.byramhills.org/uploaded/BHHS/2024-2025_School_Year/Community_Handbook/Community_Handbook_2024-2025_ao_8-16-2024_.pdf#page=63', action: 'Open the school club listing'
  },
  {
    id: 'ossining-obots', category: 'clubs', title: 'Ossining O-Bots', summary: 'Ossining’s Team 4122 builds competition robots and brings STEM activities to local students.',
    image: '', imageAlt: '', meta: 'Robotics team', place: 'Ossining', icon: 'users',
    intro: 'Students in the Ossining Engineering Club design, build, and test robots for the FIRST Robotics Competition and share their work through local outreach.',
    details: [['School', 'Ossining High School'], ['Team', 'FIRST Robotics Competition Team 4122']],
    url: 'https://www.o-bot.org/', action: 'Visit the team website'
  },
  {
    id: 'wesef', category: 'events', title: 'Westchester Science & Engineering Fair', summary: 'Present an original high school research project at Regeneron WESEF.',
    image: '', imageAlt: '', meta: 'Mar 13, 2027', place: 'Somers', icon: 'calendar',
    intro: 'Student researchers present their work to judges at the Regeneron Westchester Science & Engineering Fair.',
    details: [['When and where', 'Saturday, March 13, 2027 at Somers High School.'], ['Registration', 'Work with a registered teacher. The student registration deadline is December 1, 2026.'], ['Fee', 'The organizer lists a $100 registration fee per student.']],
    url: 'https://www.wesef.org/dates-to-know', action: 'View fair details'
  }
];
const categories = {
  all: {label:'All posts', icon:'grid'}, events: {label:'Events', tag:'Event', icon:'calendar'},
  innovations: {label:'Innovations', tag:'Innovation',icon:'bulb'}, clubs: {label:'Clubs', tag:'Club', icon:'users'},
  hackathon: {label:'Hackathon', tag:'Hackathon', icon:'terminal'}
};
const roles = {student:'Student builder', club:'School club leader', mentor:'Mentor or speaker', sponsor:'Sponsor or partner', hackathon:'Hackathon interest list'};
