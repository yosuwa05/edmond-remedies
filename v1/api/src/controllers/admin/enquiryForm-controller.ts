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

      const _limit = Number(limit) || 10; 
      const _page = Number(page) || 1; 
      const skip = (_page - 1) * _limit; 

      const filter: any = {};

      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: "i" } }, 
          { email: { $regex: q, $options: "i" } }, 
          { phone: { $regex: q, $options: "i" } }, 
        ];
      }

      if (status) {
        filter.status = status; 
      }

      const totalEnquiries = await EnquiryForm.countDocuments(filter);

      const enquiries = await EnquiryForm.find(filter)
        .sort({ createdAt: -1 })
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
      page: t.Optional(t.Number({ default: 1 })),
      limit: t.Optional(t.Number({ default: 10 })),
      q: t.Optional(t.String()), 
      status: t.Optional(t.String()), 
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
  )
  .put(
    "/:id/status",
    async ({ params, body }) => {
      try {
        const { status } = body;
        
        const updatedEnquiry = await EnquiryForm.findByIdAndUpdate(
          params.id,
          { status },
          { 
            new: true,         
            runValidators: true
          }
        );
  
        if (!updatedEnquiry) {
          return {
            success: false,
            message: "Enquiry not found!",
            statusCode: 404
          };
        }
  
        return {
          success: true,
          message: "Enquiry status updated successfully!",
          data: updatedEnquiry,
          statusCode: 200
        };
      } catch (error: any) {
        console.error("Error updating enquiry status:", error);
        return {
          success: false,
          message: "Error updating enquiry status",
          error: error.message,
          statusCode: 500
        };
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      body: t.Object({
        status: t.Union([
          t.Literal("pending"),
          t.Literal("follow-up"), 
          t.Literal("closed")
        ])
      }),
      detail: {
        summary: "Update Enquiry Status",
        tags: ["Enquiry Form"]
      }
    }
  )
