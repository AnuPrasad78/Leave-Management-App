-- 00002_seed_data.sql
-- Seed references and 2026 holiday calendars.
-- Mirrors Frontend/src/data/holidays.js and the leaveOptions list in ApplyLeave.jsx.

-- --------------------------------------------------------------------------
-- Leave types
-- --------------------------------------------------------------------------
insert into public.leave_types (id, code, name, format, is_paid) values
  (1,  'PTO',              'Paid Time Off (PTO)',     'Days', true),
  (2,  'ADOPTION',         'Adoption',                'Days', true),
  (3,  'BUSINESS_TRAVEL',  'Business Travel',         'Days', true),
  (4,  'COMP_OFF',         'Compensatory Off',        'Days', true),
  (5,  'CONTINGENCY',      'Contingency Bucket',      'Days', true),
  (6,  'LWP',              'Leave Without Pay (LWP)', 'Days', false),
  (7,  'LOP',              'Loss Of Pay (LOP)',        'Days', false),
  (8,  'SPECIAL_DAY',      'My Special Day',           'Days', true),
  (9,  'OPTIONAL_HOLIDAY', 'Optional Holiday',        'Days', true),
  (10, 'PATERNITY',        'Paternity Leave',          'Days', true),
  (11, 'VOTING',           'Voting Leave',            'Days', true),
  (12, 'WFH',              'Work From Home',          'Days', true)
on conflict (code) do nothing;

-- --------------------------------------------------------------------------
-- Holidays (2026, per location). `day` is derived from the date.
-- --------------------------------------------------------------------------
insert into public.holidays (id, country, year, location, date, day, description, is_optional) values
  -- Bangalore fixed
  (1,  'INDIA', 2026, 'Bangalore', '2026-01-26', to_char('2026-01-26'::date, 'FMDay'), 'Republic Day',                 false),
  (2,  'INDIA', 2026, 'Bangalore', '2026-05-01', to_char('2026-05-01'::date, 'FMDay'), 'May Day',                      false),
  (3,  'INDIA', 2026, 'Bangalore', '2026-05-28', to_char('2026-05-28'::date, 'FMDay'), 'Bakrid/Eid al-Adha',            false),
  (4,  'INDIA', 2026, 'Bangalore', '2026-10-02', to_char('2026-10-02'::date, 'FMDay'), 'Gandhi Jayanthi',              false),
  (5,  'INDIA', 2026, 'Bangalore', '2026-10-21', to_char('2026-10-21'::date, 'FMDay'), 'Vijayadashami',                false),
  (6,  'INDIA', 2026, 'Bangalore', '2026-11-10', to_char('2026-11-10'::date, 'FMDay'), 'Balipadyami, Deepavali',       false),
  (7,  'INDIA', 2026, 'Bangalore', '2026-12-25', to_char('2026-12-25'::date, 'FMDay'), 'Christmas',                   false),
  -- Bangalore optional
  (8,  'INDIA', 2026, 'Bangalore', '2026-01-01', to_char('2026-01-01'::date, 'FMDay'), "New Year's Day",               true),
  (9,  'INDIA', 2026, 'Bangalore', '2026-01-15', to_char('2026-01-15'::date, 'FMDay'), 'Makara Sankranthi',            true),
  (10, 'INDIA', 2026, 'Bangalore', '2026-03-04', to_char('2026-03-04'::date, 'FMDay'), 'Holi',                         true),
  (11, 'INDIA', 2026, 'Bangalore', '2026-03-19', to_char('2026-03-19'::date, 'FMDay'), 'Ugadi',                        true),
  (12, 'INDIA', 2026, 'Bangalore', '2026-03-31', to_char('2026-03-31'::date, 'FMDay'), 'Mahaveera Jayanthi',           true),
  (13, 'INDIA', 2026, 'Bangalore', '2026-04-03', to_char('2026-04-03'::date, 'FMDay'), 'Good Friday',                 true),
  (14, 'INDIA', 2026, 'Bangalore', '2026-04-14', to_char('2026-04-14'::date, 'FMDay'), 'Dr. B.R. Ambedkar Jayanthi',   true),
  (15, 'INDIA', 2026, 'Bangalore', '2026-06-26', to_char('2026-06-26'::date, 'FMDay'), 'Last Day of Moharram',        true),
  (16, 'INDIA', 2026, 'Bangalore', '2026-08-26', to_char('2026-08-26'::date, 'FMDay'), 'Eid-Milad',                   true),
  (17, 'INDIA', 2026, 'Bangalore', '2026-09-14', to_char('2026-09-14'::date, 'FMDay'), 'Ganesh Chaturthi',             true),
  (18, 'INDIA', 2026, 'Bangalore', '2026-10-20', to_char('2026-10-20'::date, 'FMDay'), 'Mahanavami, Ayudhapooja',      true),
  -- Noida fixed
  (19, 'INDIA', 2026, 'Noida', '2026-01-26', to_char('2026-01-26'::date, 'FMDay'), 'Republic Day',                   false),
  (20, 'INDIA', 2026, 'Noida', '2026-03-04', to_char('2026-03-04'::date, 'FMDay'), 'Holi',                           false),
  (21, 'INDIA', 2026, 'Noida', '2026-05-01', to_char('2026-05-01'::date, 'FMDay'), 'May Day',                        false),
  (22, 'INDIA', 2026, 'Noida', '2026-05-28', to_char('2026-05-28'::date, 'FMDay'), 'Bakrid/Eid al-Adha',              false),
  (23, 'INDIA', 2026, 'Noida', '2026-10-02', to_char('2026-10-02'::date, 'FMDay'), 'Gandhi Jayanthi',                false),
  (24, 'INDIA', 2026, 'Noida', '2026-10-20', to_char('2026-10-20'::date, 'FMDay'), 'Dusshera',                       false),
  (25, 'INDIA', 2026, 'Noida', '2026-12-25', to_char('2026-12-25'::date, 'FMDay'), 'Christmas',                     false),
  -- Noida optional
  (26, 'INDIA', 2026, 'Noida', '2026-01-01', to_char('2026-01-01'::date, 'FMDay'), "New Year's Day",                 true),
  (27, 'INDIA', 2026, 'Noida', '2026-01-14', to_char('2026-01-14'::date, 'FMDay'), 'Makar Sankranthi',               true),
  (28, 'INDIA', 2026, 'Noida', '2026-03-31', to_char('2026-03-31'::date, 'FMDay'), 'Mahaveera Jayanthi',             true),
  (29, 'INDIA', 2026, 'Noida', '2026-04-03', to_char('2026-04-03'::date, 'FMDay'), 'Good Friday',                   true),
  (30, 'INDIA', 2026, 'Noida', '2026-04-14', to_char('2026-04-14'::date, 'FMDay'), 'Dr. B.R. Ambedkar Jayanthi',     true),
  (31, 'INDIA', 2026, 'Noida', '2026-06-26', to_char('2026-06-26'::date, 'FMDay'), 'Last Day of Moharram',          true),
  (32, 'INDIA', 2026, 'Noida', '2026-08-26', to_char('2026-08-26'::date, 'FMDay'), 'Eid-Milad',                     true),
  (33, 'INDIA', 2026, 'Noida', '2026-08-28', to_char('2026-08-28'::date, 'FMDay'), 'Raksha Bandhan',                true),
  (34, 'INDIA', 2026, 'Noida', '2026-09-04', to_char('2026-09-04'::date, 'FMDay'), 'Janmashtami',                   true),
  (35, 'INDIA', 2026, 'Noida', '2026-09-14', to_char('2026-09-14'::date, 'FMDay'), 'Ganesh Chaturthi',               true),
  (36, 'INDIA', 2026, 'Noida', '2026-11-09', to_char('2026-11-09'::date, 'FMDay'), 'Day after Diwali',              true),
  -- Hyderabad fixed
  (37, 'INDIA', 2026, 'Hyderabad', '2026-01-26', to_char('2026-01-26'::date, 'FMDay'), 'Republic Day',               false),
  (38, 'INDIA', 2026, 'Hyderabad', '2026-05-01', to_char('2026-05-01'::date, 'FMDay'), 'May Day',                    false),
  (39, 'INDIA', 2026, 'Hyderabad', '2026-05-28', to_char('2026-05-28'::date, 'FMDay'), 'Bakrid/Eid al-Adha',          false),
  (40, 'INDIA', 2026, 'Hyderabad', '2026-06-02', to_char('2026-06-02'::date, 'FMDay'), 'Telangana Formation Day',    false),
  (41, 'INDIA', 2026, 'Hyderabad', '2026-10-02', to_char('2026-10-02'::date, 'FMDay'), 'Gandhi Jayanthi',            false),
  (42, 'INDIA', 2026, 'Hyderabad', '2026-11-09', to_char('2026-11-09'::date, 'FMDay'), 'Deepavali',                  false),
  (43, 'INDIA', 2026, 'Hyderabad', '2026-12-25', to_char('2026-12-25'::date, 'FMDay'), 'Christmas',                 false),
  -- Hyderabad optional
  (44, 'INDIA', 2026, 'Hyderabad', '2026-01-01', to_char('2026-01-01'::date, 'FMDay'), "New Year's Day",             true),
  (45, 'INDIA', 2026, 'Hyderabad', '2026-01-15', to_char('2026-01-15'::date, 'FMDay'), 'Makara Sankranthi',          true),
  (46, 'INDIA', 2026, 'Hyderabad', '2026-03-19', to_char('2026-03-19'::date, 'FMDay'), 'Ugadi',                      true),
  (47, 'INDIA', 2026, 'Hyderabad', '2026-03-31', to_char('2026-03-31'::date, 'FMDay'), 'Mahaveera Jayanthi',         true),
  (48, 'INDIA', 2026, 'Hyderabad', '2026-04-03', to_char('2026-04-03'::date, 'FMDay'), 'Good Friday',               true),
  (49, 'INDIA', 2026, 'Hyderabad', '2026-04-14', to_char('2026-04-14'::date, 'FMDay'), 'Dr. B.R. Ambedkar Jayanthi', true),
  (50, 'INDIA', 2026, 'Hyderabad', '2026-06-26', to_char('2026-06-26'::date, 'FMDay'), 'Last Day of Moharram',      true),
  (51, 'INDIA', 2026, 'Hyderabad', '2026-08-26', to_char('2026-08-26'::date, 'FMDay'), 'Eid-Milad',                 true),
  (52, 'INDIA', 2026, 'Hyderabad', '2026-09-14', to_char('2026-09-14'::date, 'FMDay'), 'Ganesh Chaturthi',           true),
  (53, 'INDIA', 2026, 'Hyderabad', '2026-10-20', to_char('2026-10-20'::date, 'FMDay'), 'Mahanavami, Ayudhapooja',    true),
  (54, 'INDIA', 2026, 'Hyderabad', '2026-10-21', to_char('2026-10-21'::date, 'FMDay'), 'Vijayadashami',              true)
on conflict (location, year, date) do nothing;
