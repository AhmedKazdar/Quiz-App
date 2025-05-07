import { Model } from 'mongoose';
import { Response, ResponseDocument } from './response.schema';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
export declare class ResponseService {
    private readonly responseModel;
    constructor(responseModel: Model<ResponseDocument>);
    create(createResponseDto: CreateResponseDto): Promise<Response>;
    createMultiple(createResponseDtos: CreateResponseDto[]): Promise<Response[]>;
    findAll(): Promise<Response[]>;
    findById(id: string): Promise<Response>;
    update(id: string, updateDto: UpdateResponseDto): Promise<Response>;
    delete(id: string): Promise<{
        message: string;
    }>;
    findAllWithQuestions(): Promise<Response[]>;
    findByQuestionId(questionId: string): Promise<Response[]>;
}
