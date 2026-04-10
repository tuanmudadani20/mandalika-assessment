import { z } from 'zod';

export const AccessCodeSchema = z.object({
  accessCode: z.string().min(4).optional(),
});

export const SessionIdSchema = z.object({
  sessionId: z.string().min(10),
});

export const ProfileSchema = z.object({
  sessionId: z.string().min(10),
  name: z.string().min(2),
  email: z.string().email(),
  department: z.string().min(2),
  position: z.enum(['Staff', 'Kepala Unit', 'Manager']),
  tenure: z.enum(['< 6 bulan', '6-12 bulan', '1-3 tahun', '3-5 tahun', '>= 5 tahun']),
});

export const TetradAnswerSchema = z.object({
  mostIndex: z.number().int().min(0).max(3),
  leastIndex: z.number().int().min(0).max(3),
}).refine((v) => v.mostIndex !== v.leastIndex, {
  message: 'mostIndex and leastIndex cannot be equal',
});

export const TetradSubmitSchema = z.object({
  sessionId: z.string().min(10),
  answers: z.array(TetradAnswerSchema).length(33),
  timingMs: z.number().int().nonnegative(),
});

export const SJTAnswerSchema = z.object({
  mostIndex: z.number().int().min(0).max(3),
  leastIndex: z.number().int().min(0).max(3),
}).refine((v) => v.mostIndex !== v.leastIndex, {
  message: 'mostIndex and leastIndex cannot be equal',
});

export const SJTSubmitSchema = z.object({
  sessionId: z.string().min(10),
  answers: z.array(SJTAnswerSchema).length(30),
  timingMs: z.number().int().nonnegative(),
});

export const BEIAnswerSchema = z.object({
  questionId: z.string(),
  text: z.string().min(10),
});

export const BEISubmitSchema = z.object({
  sessionId: z.string().min(10),
  answers: z.array(BEIAnswerSchema).length(8),
  timingMs: z.number().int().nonnegative(),
});
