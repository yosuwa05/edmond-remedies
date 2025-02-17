import Elysia, { t } from "elysia";
import { EnquiryForm } from "../../model/user/enquiryForm-model"; 

export const EnquiryFormController = new Elysia({
  prefix: "/enquiryForm",
  detail: {
    tags: ["Enquiry Form"],
  },
})
.get(
  "/",
  async ({ query }) => {
    try {
      const { page, limit, q, status } = query;

      const _limit = Number(limit) || 10; // Ensure limit is a number
      const _page = Number(page) || 1; // Ensure page is a number
      const skip = (_page - 1) * _limit; // Calculate pagination offset

      // Create dynamic filter object
      const filter: any = {};

      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: "i" } }, // Search by name (case-insensitive)
          { email: { $regex: q, $options: "i" } }, // Search by email
          { phone: { $regex: q, $options: "i" } }, // Search by phone
        ];
      }

      if (status) {
        filter.status = status; // Filter by status if provided
      }

      // Fetch total count (for pagination info)
      const totalEnquiries = await EnquiryForm.countDocuments(filter);

      // Fetch paginated data
      const enquiries = await EnquiryForm.find(filter)
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(_limit);

      return {
        success: true,
        message: "Enquiries fetched successfully!",
        data: enquiries,
        pagination: {
          total: totalEnquiries,
          page: _page,
          limit: _limit,
          totalPages: Math.ceil(totalEnquiries / _limit),
        },
      };
    } catch (error: any) {
      console.error("Error fetching enquiries:", error);
      return {
        success: false,
        message: "Error fetching enquiries",
        error: error.message,
      };
    }
  },
  {
    query: t.Object({
      page: t.Optional(t.Number({ default: 1 })), // Page number (optional, defaults to 1)
      limit: t.Optional(t.Number({ default: 10 })), // Items per page (optional, defaults to 10)
      q: t.Optional(t.String()), // Search query (optional)
      status: t.Optional(t.String()), // Status filter (optional)
    }),
    detail: {
      summary: "Get all Enquiry Forms with Pagination & Filtering",
    },
  }
)


  .get(
    "/:id",
    async ({ params }) => {
      try {
        const enquiry = await EnquiryForm.findById(params.id);
  
        if (!enquiry) {
          return {
            success: false,
            message: "Enquiry not found!",
          };
        }
  
        return {
          success: true,
          message: "Enquiry fetched successfully!",
          data: enquiry,
        };
      } catch (error: any) {
        console.error("Error fetching enquiry:", error);
        return {
          success: false,
          message: "Error fetching enquiry",
          error: error.message,
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Get Enquiry by ID",
      },
    }
  );

