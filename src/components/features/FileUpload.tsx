import { Box, Text, Icon, VStack, Input, useToast } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaFileAlt, FaTimes } from 'react-icons/fa';
import CustomButton from '../common/CustomButton';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
}

const FileUpload = ({ onFileSelect, accept = ".pdf,.docx,.doc" }: FileUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const toast = useToast();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            validateAndSetFile(files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];

        // Simple validation (can be expanded)
        if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
            toast({
                title: 'Invalid file type',
                description: 'Please upload a PDF or DOCX file.',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast({
                title: 'File too large',
                description: 'Maximum file size is 5MB.',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        setSelectedFile(file);
        onFileSelect(file);
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <Box
            borderWidth="2px"
            borderStyle="dashed"
            borderColor={isDragOver ? 'brand.500' : 'gray.300'}
            borderRadius="xl"
            bg={isDragOver ? 'brand.50' : 'gray.50'}
            p={10}
            textAlign="center"
            cursor="pointer"
            transition="all 0.2s"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            position="relative"
        >
            <Input
                type="file"
                ref={inputRef}
                display="none"
                accept={accept}
                onChange={handleChange}
            />

            {selectedFile ? (
                <VStack spacing={3}>
                    <Icon as={FaFileAlt} w={10} h={10} color="brand.500" />
                    <Text fontWeight="bold">{selectedFile.name}</Text>
                    <Text fontSize="sm" color="gray.500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</Text>
                    <CustomButton size="sm" variant="ghost" colorScheme="red" onClick={clearFile} leftIcon={<Icon as={FaTimes} />}>
                        Remove File
                    </CustomButton>
                </VStack>
            ) : (
                <VStack spacing={3}>
                    <Icon as={FaCloudUploadAlt} w={12} h={12} color="gray.400" />
                    <Text fontWeight="bold" fontSize="lg">
                        Click or drag resume here
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        Supports PDF, DOCX (Max 5MB)
                    </Text>
                </VStack>
            )}
        </Box>
    );
};

export default FileUpload;
