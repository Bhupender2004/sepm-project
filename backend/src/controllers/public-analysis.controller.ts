import { Request, Response } from 'express';
import * as fs from 'fs/promises';
import documentParser from '../services/document-parser.service';
import aiService from '../services/ai.service';
import logger from '../utils/logger.util';

/**
 * POST /api/analyses/public
 * Multipart: field "resume" (file), field "jobDescription" (text)
 * No authentication required — runs full analysis inline and returns result.
 */
class PublicAnalysisController {
    async analyze(req: Request, res: Response) {
        const filePath = req.file?.path;

        try {
            const { jobDescription } = req.body;

            if (!req.file) {
                res.status(400).json({ success: false, message: 'Resume file is required (PDF or DOCX).' });
                return;
            }

            if (!jobDescription || !jobDescription.trim()) {
                res.status(400).json({ success: false, message: 'Job description text is required.' });
                return;
            }

            logger.info(`Public analysis started — file: ${req.file.originalname}`);

            // ── Step 1: Parse resume text ───────────────────────────────────
            const rawText = await documentParser.parseDocument(req.file.path);
            const resumeText = documentParser.cleanText(rawText);

            if (!resumeText || resumeText.length < 50) {
                res.status(422).json({ success: false, message: 'Could not extract text from the uploaded resume. Please try a different file.' });
                return;
            }

            // ── Step 2: Parse resume sections with AI ───────────────────────
            const parsedResume = await aiService.parseResume(resumeText);

            // ── Step 3: Parse job description with AI ───────────────────────
            const parsedJD = await aiService.parseJobDescription(jobDescription);

            // ── Step 4: Run match analysis with AI ──────────────────────────
            const analysis = await aiService.analyzeMatch(
                parsedResume,
                parsedJD,
                resumeText,
                jobDescription
            );

            // ── Step 5: Build structured response ───────────────────────────
            const result = {
                overallScore: analysis.overallScore ?? 0,
                atsScore: analysis.atsScore ?? 0,
                summary: analysis.summary ?? '',
                categoryScores: {
                    technicalSkills: analysis.categoryScores?.technicalSkills ?? 0,
                    softSkills: analysis.categoryScores?.softSkills ?? 0,
                    experience: analysis.categoryScores?.experience ?? 0,
                    education: analysis.categoryScores?.education ?? 0,
                    keywords: analysis.categoryScores?.keywords ?? 0,
                },
                matchedElements: {
                    skills: analysis.matchedElements?.skills ?? [],
                    experience: analysis.matchedElements?.experience ?? [],
                    education: analysis.matchedElements?.education ?? [],
                    keywords: analysis.matchedElements?.keywords ?? [],
                },
                missingElements: {
                    skills: analysis.missingElements?.skills ?? [],
                    experience: analysis.missingElements?.experience ?? [],
                    keywords: analysis.missingElements?.keywords ?? [],
                },
                keywordSuggestions: (analysis.keywordSuggestions ?? []).map((kw: any) => ({
                    keyword: kw.keyword ?? '',
                    priority: kw.priority ?? 'medium',
                    suggestedSection: kw.suggestedSection ?? 'Skills',
                    exampleUsage: kw.exampleUsage ?? '',
                    importanceScore: kw.importanceScore ?? 50,
                })),
                recommendations: analysis.recommendations ?? [],
                resumeSkills: parsedResume.skills ?? [],
            };

            logger.info(`Public analysis completed — score: ${result.overallScore}`);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            logger.error('Public analysis error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Analysis failed. Please try again.',
            });
        } finally {
            // Clean up uploaded temp file
            if (filePath) {
                fs.unlink(filePath).catch(() => { /* ignore */ });
            }
        }
    }
}

export default new PublicAnalysisController();
