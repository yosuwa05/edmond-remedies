import Elysia, { t } from "elysia";
import { EnquiryForm } from "../../model/user/enquiryForm-model"; 

export const EnquiryFormController = new Elysia({
  prefix: "/enquiryForm",
  detail: {
    tags: ["Enquiry Form"],
  },
})
.post(
  "/submit",
  async ({ body }) => {
    try {
      const { name, phone,phoneCountry, email, hospitalName, hospitalType, country,state, city, message } = body;

        const newEnquiry = await EnquiryForm.create({
          name,
          phone,
          countryCode:phoneCountry,
          email,
          hospitalName,
          hospitalType,
          country,
          state,
          city,
          message,
          status:"pending",
        });

        return {
          success: true,
          message: "Enquiry form submitted successfully!",
          data: newEnquiry,
        };
      
    } catch (error: any) {
      console.error("Error saving enquiry:", error);
      return {
        success: false,
        message: "Error submitting form",
        error: error.message,
      };
    }
  },
  {
    body: t.Object({
      name: t.String(),
      phone: t.String(), 
      phoneCountry:t.String(),
      email: t.String({ format: "email" }),
      hospitalName: t.String(),
      hospitalType: t.Optional(t.String()),
      country: t.String(),
      state: t.Optional(t.String()),
      city: t.Optional(t.String()),
      message: t.String({ minLength: 5 }),
    }),
    detail: {
      summary: "Submit Enquiry Form",
    },
  }
)

