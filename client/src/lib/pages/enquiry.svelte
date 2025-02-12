<script>
    let name = "";
    let phone = "";
    let email = "";
    let hospitalName = "";
    let hospitalType = "";
    let country = "";
    let city = "";
    let message = "";
  
    const hospitalTypes = ["Public", "Private", "Clinic", "Specialized"];
    const countries = ["India", "USA", "UK", "Canada"];
    const cities = {
      India: ["Delhi", "Mumbai", "Bangalore"],
      USA: ["New York", "Los Angeles", "Chicago"],
      UK: ["London", "Manchester", "Birmingham"],
      Canada: ["Toronto", "Vancouver", "Montreal"]
    };
  
    function submitForm() {
      console.log({
        name, phone, email, hospitalName, hospitalType, country, city, message
      });
      alert("Enquiry Submitted Successfully!");
    }
  </script>


<main class="py-5 px-10 flex lg:flex-row flex-col justify-center items-center lg:items-start lg:justify-normal">
    <section class="lg:w-1/2">
<div class="flex flex-col md:gap-6 gap-3">
    <p class="lg:text-base text-center lg:text-left text-sm font-medium font-sans text-[#178490]">
        Adaptable App
    </p>
    <h1 class="lg:text-5xl text-3xl text-center lg:text-left leading-tight font-bold text-[#252525]">
        Flexible for all types of <br /> hospitals
    </h1>
</div>
    </section>
    <section class="lg:w-1/2 md:w-3/4 mt-5  lg:mt-0 flex lg:justify-end justify-center lg:pr-20">
<div class="p-5 lg:w-3/4 w-full  bg-[#F3F9F9] border rounded-lg border-[#DFE3E8]">
<h1 class="text-xl font-semibold">
    Enquiry Form
</h1>
<div class=" mx-auto  py-6 rounded-lg ">

    <div class="grid grid-cols-1 gap-4">
      <div>
        <label class=" text-base  text-[#6B7888] font-medium">Full Name</label>
        <input type="text" bind:value={name} class="input" placeholder="Enter your full name">
      </div>
  
      <div>
        <label class="block text-[#6B7888] text-base font-medium">Phone Number</label>
        <input type="tel" bind:value={phone} class="input" placeholder="Enter your phone number">
      </div>
  
      <div>
        <label class=" text-base text-[#6B7888] font-medium">Email ID</label>
        <input type="email" bind:value={email} class="input" placeholder="Enter your email">
      </div>
  
      <div>
        <label class=" text-base  text-[#6B7888] font-medium">Hospital Name</label>
        <input type="text" bind:value={hospitalName} class="input" placeholder="Enter hospital name">
      </div>
  
      <div>
        <label class=" text-base text-[#6B7888] font-medium">Hospital Type</label>
        <select bind:value={hospitalType} class="input">
          <option value="" disabled selected>--</option>
          {#each hospitalTypes as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </div>
  
      <div>
        <label class="block text-[#6B7888] text-base font-medium">Country</label>
        <select bind:value={country} class="input">
          <option value="" disabled selected>Select country</option>
          {#each countries as c}
            <option value={c}>{c}</option>
          {/each}
        </select>
      </div>
  
      {#if country}
      <div>
        <label class="block text-[#6B7888] text-base font-medium">City</label>
        <select bind:value={city} class="input">
          <option value="" disabled selected>Select city</option>
          {#each cities[country] || [] as cityOption}
            <option value={cityOption}>{cityOption}</option>
          {/each}
        </select>
      </div>
      {/if}
  
      <div>
        <label class="block text-[#6B7888] text-base font-medium">Message</label>
        <textarea bind:value={message} class="input h-24" placeholder="Enter your message"></textarea>
      </div>
  <div class="flex justify-end">
    <button on:click={submitForm} class="bg-[#178490] px-5 font-medium w-fit text-white py-2 rounded-xl">
        Submit
      </button>
  </div>
     
    </div>
  </div>
</div>
    </section>
</main>
<style>
    .input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
      outline: none;
      transition: border-color 0.2s;
    }
    .input:focus {
      border-color: #1D4ED8;
    }
  </style>