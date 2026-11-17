import { Contact, type ContactDocument } from "../models/Contact.js";
import { NotFoundError } from "../utils/errors.js";
import type { CreateContactInput, UpdateContactInput } from "../validators/contact.validator.js";

export class ContactService {
  /**
   * Submit a new contact / inquiry message (public)
   */
  async createContact(input: CreateContactInput): Promise<ContactDocument> {
    const contact = await Contact.create({
      ...input,
      status: "pending",
      isActive: true,
      isDisplay: true,
      deletedAt: null,
    });

    return contact;
  }

  /**
   * Admin: Get inquiries with pagination, status filter, and keyword search
   */
  async getAdminContacts(options: {
    page: number;
    limit: number;
    skip: number;
    status?: string;
    search?: string;
  }) {
    const query: Record<string, unknown> = {
      isDisplay: true,
    };

    if (options.status && ["pending", "in_progress", "resolved"].includes(options.status)) {
      query.status = options.status;
    }

    if (options.search && options.search.trim().length > 0) {
      const regex = new RegExp(options.search.trim(), "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { subject: regex },
        { message: regex },
      ];
    }

    const [items, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(options.skip)
        .limit(options.limit)
        .lean(),
      Contact.countDocuments(query),
    ]);

    return {
      items,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit) || 1,
      },
    };
  }

  /**
   * Admin: Get inquiry detail by ID
   */
  async getContactById(id: string): Promise<ContactDocument> {
    const contact = await Contact.findOne({
      _id: id,
      isDisplay: true,
    });

    if (!contact) {
      throw new NotFoundError("Contact inquiry not found");
    }

    return contact;
  }

  /**
   * Admin: Update inquiry details or status
   */
  async updateContact(id: string, input: UpdateContactInput): Promise<ContactDocument> {
    const contact = await Contact.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: input },
      { new: true, runValidators: true }
    );

    if (!contact) {
      throw new NotFoundError("Contact inquiry not found");
    }

    return contact;
  }

  /**
   * Admin: Soft delete inquiry
   */
  async softDeleteContact(id: string): Promise<void> {
    const result = await Contact.findOneAndUpdate(
      { _id: id, isDisplay: true },
      {
        $set: {
          isDisplay: false,
          deletedAt: new Date(),
        },
      }
    );

    if (!result) {
      throw new NotFoundError("Contact inquiry not found");
    }
  }
}

export const contactService = new ContactService();
