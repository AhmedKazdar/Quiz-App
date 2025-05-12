import { ResponseService } from './response.service';
import { UserService } from '../user/user.service';
import { QuestionService } from '../question/question.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { Types } from 'mongoose';
interface Response {
    userId: Types.ObjectId;
    questionId: Types.ObjectId;
    isCorrect: boolean;
    text: string;
}
export declare class ResponseController {
    private readonly responseService;
    private readonly userService;
    private readonly questionService;
    constructor(responseService: ResponseService, userService: UserService, questionService: QuestionService);
    create(createResponseDto: CreateResponseDto): Promise<{
        message: string;
        response: import("./response.schema").Response;
    }>;
    createMultiple(createResponseDtos: CreateResponseDto[]): Promise<{
        message: string;
        responses: import("./response.schema").Response[];
    } | {
        message: any;
        responses?: undefined;
    }>;
    ping(): string;
    submitResponses(responses: {
        userId: string;
        questionId: string;
        isCorrect: boolean;
        selectedAnswerText: string;
    }[]): Promise<{
        message: string;
        responses: Response[];
        score: number;
    }>;
    findAll(): Promise<{
        message: string;
        responses: import("./response.schema").Response[];
    } | {
        message: any;
        responses?: undefined;
    }>;
    findByQuestionId(questionId: string): Promise<{
        message: string;
        responses: import("./response.schema").Response[];
    } | {
        message: any;
        responses?: undefined;
    }>;
    update(id: string, updateResponseDto: UpdateResponseDto): Promise<{
        message: string;
        updatedResponse: import("./response.schema").Response;
    } | {
        message: any;
        updatedResponse?: undefined;
    }>;
    delete(id: string): Promise<{
        message: any;
    }>;
}
export {};
