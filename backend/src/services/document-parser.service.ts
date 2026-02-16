import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';
import { InternalServerError } from '../utils/errors.util';

export class DocumentParserService {
    /**
     * Extract text from PDF file
     */
    async parsePDF(filePath: string): Promise<string> {
        try {
            const dataBuffer = await fs.readFile(filePath);
            const data = await pdfParse(dataBuffer);
            return data.text;
        } catch (error) {
            throw new InternalServerError('Failed to parse PDF file');
        }
    }

    /**
     * Extract text from DOCX file
     */
    async parseDOCX(filePath: string): Promise<string> {
        try {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } catch (error) {
            throw new InternalServerError('Failed to parse DOCX file');
        }
    }

    /**
     * Parse document based on file extension
     */
    async parseDocument(filePath: string): Promise<string> {
        const ext = path.extname(filePath).toLowerCase();

        switch (ext) {
            case '.pdf':
                return this.parsePDF(filePath);
            case '.docx':
                return this.parseDOCX(filePath);
            default:
                throw new InternalServerError('Unsupported file format');
        }
    }

    /**
     * Clean extracted text
     */
    cleanText(text: string): string {
        return text
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
            .trim();
    }
}

export default new DocumentParserService();
