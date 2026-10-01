export const holidayCountries = ['INDIA'];
export const holidayYears = ['2026'];
export const holidayLocations = ['Bangalore', 'Noida', 'Hyderabad'];

/** @type {Record<string, { fixed: { date: string, day: string, description: string }[], optional: { date: string, day: string, description: string }[] }>} */
export const holidayCalendars = {
  Bangalore: {
    fixed: [
      { date: 'Jan 26', day: 'Monday', description: 'Republic Day' },
      { date: 'May 01', day: 'Friday', description: 'May Day' },
      { date: 'May 28', day: 'Thursday', description: 'Bakrid/Eid al-Adha' },
      { date: 'Oct 02', day: 'Friday', description: 'Gandhi Jayanthi' },
      { date: 'Oct 21', day: 'Wednesday', description: 'Vijayadashami' },
      { date: 'Nov 10', day: 'Tuesday', description: 'Balipadyami, Deepavali' },
      { date: 'Dec 25', day: 'Friday', description: 'Christmas' },
    ],
    optional: [
      { date: 'Jan 01', day: 'Thursday', description: "New Year's Day" },
      { date: 'Jan 15', day: 'Thursday', description: 'Makara Sankranthi' },
      { date: 'Mar 04', day: 'Wednesday', description: 'Holi' },
      { date: 'Mar 19', day: 'Thursday', description: 'Ugadi' },
      { date: 'Mar 31', day: 'Tuesday', description: 'Mahaveera Jayanthi' },
      { date: 'Apr 03', day: 'Friday', description: 'Good Friday' },
      { date: 'Apr 14', day: 'Tuesday', description: 'Dr. B.R. Ambedkar Jayanthi' },
      { date: 'Jun 26', day: 'Friday', description: 'Last Day of Moharram' },
      { date: 'Aug 26', day: 'Wednesday', description: 'Eid-Milad' },
      { date: 'Sep 14', day: 'Monday', description: 'Ganesh Chaturthi' },
      { date: 'Oct 20', day: 'Tuesday', description: 'Mahanavami, Ayudhapooja' },
    ],
  },
  Noida: {
    fixed: [
      { date: 'Jan 26', day: 'Monday', description: 'Republic Day' },
      { date: 'Mar 04', day: 'Wednesday', description: 'Holi' },
      { date: 'May 01', day: 'Friday', description: 'May Day' },
      { date: 'May 28', day: 'Thursday', description: 'Bakrid/Eid al-Adha' },
      { date: 'Oct 02', day: 'Friday', description: 'Gandhi Jayanthi' },
      { date: 'Oct 20', day: 'Tuesday', description: 'Dusshera' },
      { date: 'Dec 25', day: 'Friday', description: 'Christmas' },
    ],
    optional: [
      { date: 'Jan 01', day: 'Thursday', description: "New Year's Day" },
      { date: 'Jan 14', day: 'Wednesday', description: 'Makar Sankranthi' },
      { date: 'Mar 31', day: 'Tuesday', description: 'Mahaveera Jayanthi' },
      { date: 'Apr 03', day: 'Friday', description: 'Good Friday' },
      { date: 'Apr 14', day: 'Tuesday', description: 'Dr. B.R. Ambedkar Jayanthi' },
      { date: 'Jun 26', day: 'Friday', description: 'Last Day of Moharram' },
      { date: 'Aug 26', day: 'Wednesday', description: 'Eid-Milad' },
      { date: 'Aug 28', day: 'Friday', description: 'Raksha Bandhan' },
      { date: 'Sep 04', day: 'Friday', description: 'Janmashtami' },
      { date: 'Sep 14', day: 'Monday', description: 'Ganesh Chaturthi' },
      { date: 'Nov 09', day: 'Monday', description: 'Day after Diwali' },
    ],
  },
  Hyderabad: {
    fixed: [
      { date: 'Jan 26', day: 'Monday', description: 'Republic Day' },
      { date: 'May 01', day: 'Friday', description: 'May Day' },
      { date: 'May 28', day: 'Thursday', description: 'Bakrid/Eid al-Adha' },
      { date: 'Jun 02', day: 'Tuesday', description: 'Telangana Formation Day' },
      { date: 'Oct 02', day: 'Friday', description: 'Gandhi Jayanthi' },
      { date: 'Nov 09', day: 'Monday', description: 'Deepavali' },
      { date: 'Dec 25', day: 'Friday', description: 'Christmas' },
    ],
    optional: [
      { date: 'Jan 01', day: 'Thursday', description: "New Year's Day" },
      { date: 'Jan 15', day: 'Thursday', description: 'Makara Sankranthi' },
      { date: 'Mar 19', day: 'Thursday', description: 'Ugadi' },
      { date: 'Mar 31', day: 'Tuesday', description: 'Mahaveera Jayanthi' },
      { date: 'Apr 03', day: 'Friday', description: 'Good Friday' },
      { date: 'Apr 14', day: 'Tuesday', description: 'Dr. B.R. Ambedkar Jayanthi' },
      { date: 'Jun 26', day: 'Friday', description: 'Last Day of Moharram' },
      { date: 'Aug 26', day: 'Wednesday', description: 'Eid-Milad' },
      { date: 'Sep 14', day: 'Monday', description: 'Ganesh Chaturthi' },
      { date: 'Oct 20', day: 'Tuesday', description: 'Mahanavami, Ayudhapooja' },
      { date: 'Oct 21', day: 'Wednesday', description: 'Vijayadashami' },
    ],
  },
};
