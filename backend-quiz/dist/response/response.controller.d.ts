import { ResponseService } from './response.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
export declare class ResponseController {
    private readonly responseService;
    constructor(responseService: ResponseService);
    create(createResponseDto: CreateResponseDto): Promise<{
        message: string;
        response: import("./response.schema").Response;
    } | {
        message: any;
        response?: undefined;
    }>;
    createMultiple(createResponseDtos: CreateResponseDto[]): Promise<{
        message: string;
        responses: import("./response.schema").Response[];
    } | {
        message: any;
        responses?: undefined;
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
