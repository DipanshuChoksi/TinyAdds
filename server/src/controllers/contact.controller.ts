import type { Request, Response, NextFunction } from "express";
import { contactService } from "../services/contact.service.js";
import {
  validateCreateContact,
  validateUpdateContact,
  validateObjectId,
  validatePagination,
} from "../validators/contact.validator.js";
import { sendSuccess } from "../utils/response.js";

export class ContactController {
  /**
   * Public: Submit a contact message
   */
  async submitContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedInput = validateCreateContact(req.body);
      const contact = await contactService.createContact(validatedInput);

      res.status(201).json(
        sendSuccess({
          _id: contact._id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          subject: contact.subject,
          message: contact.message,
          createdAt: contact.createdAt,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: List inquiries with pagination and filters
   */
  async getAdminContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const status = typeof req.query.status === "string" ? req.query.status : undefined;
      const search = typeof req.query.search === "string" ? req.query.search : undefined;

      const result = await contactService.getAdminContacts({
        ...pagination,
        ...(status ? { status } : {}),
        ...(search ? { search } : {}),
      });

      res.status(200).json(sendSuccess(result.items, result.pagination));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Get inquiry detail by ID
   */
  async getContactById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateObjectId(req.params.id as string);
      const contact = await contactService.getContactById(id);
      res.status(200).json(sendSuccess(contact));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Update inquiry (e.g. status or details)
   */
  async updateContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateObjectId(req.params.id as string);
      const validatedInput = validateUpdateContact(req.body);
      const contact = await contactService.updateContact(id, validatedInput);
      res.status(200).json(sendSuccess(contact));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Soft delete inquiry
   */
  async softDeleteContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateObjectId(req.params.id as string);
      await contactService.softDeleteContact(id);
      res.status(200).json(sendSuccess({ message: "Contact inquiry deleted successfully" }));
    } catch (error) {
      next(error);
    }
  }
}

export const contactController = new ContactController();
