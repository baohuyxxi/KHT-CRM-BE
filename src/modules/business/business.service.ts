import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Business, BusinessDocument } from "./schemas/business.schema";
import { Counter } from "../customer/schemas/customer.schema";
import { Model } from "mongoose";
import { CreateBusinessDto } from "./dto/business.dto";


@Injectable()
export class BusinessService {
    constructor(
        @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
        @InjectModel(Counter.name) private counterModel: Model<Counter>,
    ) { }

    async createBusiness(data: CreateBusinessDto): Promise<Business> {
        const session = await this.businessModel.db.startSession();
        session.startTransaction();

        try {
            const counter = await this.counterModel.findByIdAndUpdate(
                'businesses',
                { $inc: { seq: 1 } },
                { new: true, upsert: true, session }
            );

            const busId = 'DN' + counter.seq.toString().padStart(7, '0');
            const newBusiness = new this.businessModel({ ...data, busId });

            await newBusiness.save({ session });
            await session.commitTransaction();

            return newBusiness;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        }
    }

    async findAllByUserId(userId): Promise<Business[]> {
        return this.businessModel.find({ _id: userId }).populate('customer').populate('user').exec();
    }
}