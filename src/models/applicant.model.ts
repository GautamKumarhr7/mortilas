import { pgTable, serial, integer, varchar, timestamp, text, date, numeric } from 'drizzle-orm/pg-core';
import { jobPosts } from './job-post.model.js';
import { users } from './user.model.js';

export const applicants = pgTable('applicants', {
  id: serial('id').primaryKey(),
  jobPostId: integer('job_post_id').references(() => jobPosts.id).notNull(),

  // Personal info
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  resumeUrl: varchar('resume_url', { length: 500 }), // uploaded file path / URL

  // Application workflow status
  status: varchar('status', { length: 50 }).default('applied').notNull(),
  // applied → shortlisted → interview_scheduled → selected → rejected → onboarded

  // Shortlist
  shortlistedBy: integer('shortlisted_by').references(() => users.id),
  shortlistedAt: timestamp('shortlisted_at'),

  // Interview
  interviewDate: timestamp('interview_date'),
  interviewRemarks: text('interview_remarks'),
  interviewedBy: integer('interviewed_by').references(() => users.id),

  // Selection / Rejection
  selectedBy: integer('selected_by').references(() => users.id),
  selectedAt: timestamp('selected_at'),
  rejectedBy: integer('rejected_by').references(() => users.id),
  rejectedAt: timestamp('rejected_at'),
  rejectionReason: varchar('rejection_reason', { length: 500 }),

  // Onboarding (filled when status = onboarded)
  onboardedUserId: integer('onboarded_user_id').references(() => users.id), // FK to new user record
  joiningDate: date('joining_date'),
  basicPay: numeric('basic_pay'),
  documentPath: varchar('document_path', { length: 500 }), // onboarding documents

  remarks: varchar('remarks', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Applicant = typeof applicants.$inferSelect;
export type NewApplicant = typeof applicants.$inferInsert;
