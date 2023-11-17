import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

export const createLayout = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      if (!type) return next(new ErrorHandler("Sorry Error occurred", 400));

      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist)
        return next(
          new ErrorHandler(
            `Sorry! This chosen option: ${type} already exist, you can update it or delete it`,
            400
          )
        );

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;

        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "Layout",
        });

        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        const createBanner = await LayoutModel.create({
          type: "Banner",
          banner,
        });

        if (createBanner) {
          return res.status(201).json({
            success: true,
            createBanner,
            message: "Banner created successfully",
          });
        } else {
          return next(
            new ErrorHandler("Error occurred uploading banner image", 400)
          );
        }
      } else if (type === "FAQ") {
        const { faq } = req.body;
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );

        await LayoutModel.create({ type: "FAQ", faq: faqItems });

        return res.status(201).json({
          success: true,
          message: "FAQ created successfully",
        });
      } else if (type === "Categories") {
        const { categories } = req.body;
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.create({
          type: "Categories",
          categories: categoriesItems,
        });

        return res.status(201).json({
          success: true,
          message: "Categories created successfully",
        });
      } else {
        return next(new ErrorHandler("Sorry choose input", 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Edit layout
export const editLayout = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (type === "Banner") {
        const bannerData:any = await LayoutModel.findOne({type: "Banner"})
        const {image, title, subTitle} = req.body;
      
        if(bannerData){
          await cloudinary.v2.uploader.destroy(bannerData.banner.image.public_id);
        }

        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "Layout",
        });

        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        const updateBanner = await LayoutModel.findByIdAndUpdate(bannerData._id,{
          type: "Banner",
          banner,
        });

        if (updateBanner) {
          return res.status(201).json({
            success: true,
            updateBanner,
            message: "Banner updated successfully",
          });
        } else {
          return next(
            new ErrorHandler("Error occurred uploading banner image", 400)
          );
        }
      } else if (type === "FAQ") {
        const { faq } = req.body;
        const faqItem = await LayoutModel.findOne({type: "FAQ"})
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );

        await LayoutModel.findByIdAndUpdate(faqItem?._id, { type: "FAQ", faq: faqItems });

        return res.status(201).json({
          success: true,
          message: "FAQ updated successfully",
        });

      } else if (type === "Categories") {
        const { categories } = req.body;
        const categoryItem = await LayoutModel.findOne({ type: "Categories" });
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(categoryItem?._id, {
          type: "Categories",
          categories: categoriesItems,
        });

        return res.status(201).json({
          success: true,
          message: "Categories updated successfully",
        });
      } else {
        return next(new ErrorHandler("Sorry choose input", 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
