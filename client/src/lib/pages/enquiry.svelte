<script>
	import Icon from "@iconify/svelte";

// @ts-nocheck

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


<main class="py-5 lg:px-10  px-5 flex lg:flex-row flex-col justify-center items-center lg:items-start lg:justify-normal">
    <section class="lg:w-3/4 w-full ">
<div class="flex flex-col md:gap-6 gap-3">
    <p class="lg:text-base text-center lg:text-left text-sm font-medium font-sans text-[#178490]">
        Adaptable App
    </p>
    <h1 class="lg:text-5xl text-3xl text-center lg:text-left leading-tight font-bold text-[#252525]">
        Flexible for all types of <br /> hospitals
    </h1>
</div>

<div class="">
    <div class="mt-10 lg:w-[90%]">
        <div class=" flex md:flex-row flex-col md:gap-0 gap-10"   
     >
        <div class="md:w-1/2 p-5"
        style="background: linear-gradient(-1deg, #FFFFFF 60.39%, #F3F9F9 100%) padding-box,
        linear-gradient(1deg, #FFFFFF 1%, #44A7B2 422.76%) border-box;
">
            <p class="bg-[#F5F6F7] font-sans font-medium text-lg py-2 px-3 rounded-lg w-fit text-[#178490]">Type 1</p>
           <div class="mt-5">
            <div class="flex items-center gap-8 ">
                <img src="/icons/tic.svg" class="w-5 h-5" alt="">
                <p class="text-[#05003893] lg:text-3xl text-2xl  tracking-wide">One Doctor</p>
            </div>
           </div>
        
        </div>
        <div class="md:w-1/2 p-5"
        style="background: linear-gradient(-1deg, #FFFFFF 60.39%, #F3F9F9 100%) padding-box,
        linear-gradient(1deg, #FFFFFF 1%, #44A7B2 422.76%) border-box;
">
            <p class="bg-[#F5F6F7] font-sans font-medium text-lg py-2 px-3 rounded-lg w-fit text-[#178490]">Type 2</p>
           <div class="mt-5 flex flex-col gap-8">
            <div class="flex items-center gap-8 ">
                <img src="/icons/tic.svg" class="w-5 h-5" alt="">
                <p class="text-[#05003893] lg:text-3xl text-2xl  tracking-wide">One Reception</p>
            </div>
            <div class="flex items-center gap-8 ">
                <img src="/icons/tic.svg" class="w-5 h-5" alt="">
                <p class="text-[#05003893] lg:text-3xl text-2xl  tracking-wide">One Doctor</p>
            </div>
           </div>
        
        </div>
        </div>
        
        </div>
        <div class="md:mt-16 mt-10  lg:w-[90%]">
            <div class="flex md:flex-row flex-col md:gap-0 gap-10">
            <div class="md:w-1/2 p-5"
            style="background: linear-gradient(-1deg, #FFFFFF 60.39%, #F3F9F9 100%) padding-box,
            linear-gradient(1deg, #FFFFFF 1%, #44A7B2 422.76%) border-box;
    ">
                <p class="bg-[#F5F6F7] font-sans font-medium text-lg py-2 px-3 rounded-lg w-fit text-[#178490]">Type 3</p>
               <div class="mt-5 flex flex-col gap-8">
                <div class="flex items-center gap-8 ">
                    <img src="/icons/tic.svg" class="w-5 h-5" alt="">
                    <p class="text-[#05003893] lg:text-3xl text-2xl  tracking-wide">One Reception</p>
                </div>
                <div class="flex items-center gap-8 ">
                    <img src="/icons/tic.svg" class="w-5 h-5" alt="">
                    <p class="text-[#05003893] lg:text-3xl text-2xl  tracking-wide">Multiple Departments</p>
                </div>
                <div class="flex items-center gap-8 ">
                    <img src="/icons/tic.svg" class="w-5 h-5" alt="">
                    <p class="text-[#05003893] lg:text-3xl text-2xl  tracking-wide">Multiple Doctor</p>
                </div>
               </div>
            
            </div>
            <div class="md:w-1/2 p-5"
            style="background: linear-gradient(-1deg, #FFFFFF 60.39%, #F3F9F9 100%) padding-box,
            linear-gradient(1deg, #FFFFFF 1%, #44A7B2 422.76%) border-box;
    ">
                <p class="bg-[#F5F6F7] font-sans font-medium text-lg py-2 px-3 rounded-lg w-fit text-[#178490]">Type 4</p>
               <div class="mt-5 flex flex-col gap-8">
                <div class="flex items-center gap-8 ">
                    <img src="/icons/tic.svg" class="w-5 h-5" alt="">
                    <p class="text-[#05003893] lg:text-3xl text-2xl tracking-wide">Multiple Reception</p>
                </div>
                <div class="flex items-center gap-8 ">
                    <img src="/icons/tic.svg" class="w-5 h-5" alt="">
                    <p class="text-[#05003893] lg:text-3xl text-2xl  tracking-wide">Multiple Departments</p>
                </div>
                <div class="flex items-center gap-8 ">
                    <img src="/icons/tic.svg" class="w-5 h-5" alt="">
                    <p class="text-[#05003893] lg:text-3xl text-2xl  tracking-wide">Multiple Doctor</p>
                </div>
               </div>
            
            </div>
            </div>
            
            </div>
</div>
    </section>
    <section class="lg:w-2/5 md:w-3/4  md:mt-20 mt-10  lg:mt-0 flex lg:justify-end justify-center ">
<div class="p-5  w-full  bg-[#F3F9F9] border rounded-lg border-[#DFE3E8]">
<h1 class="md:text-2xl text-xl  font-semibold">
    Enquiry Form
</h1>
<div class=" mx-auto  py-6 rounded-lg ">

    <div class="grid grid-cols-1 gap-4">
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class=" text-base  text-[#6B7888] font-medium">Full Name</label>
        <input type="text" bind:value={name} class="input" placeholder="Enter your full name">
      </div>
  
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-[#6B7888] text-base font-medium">Phone Number</label>
        <input type="tel" bind:value={phone} class="input" placeholder="Enter your phone number">
      </div>
  
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class=" text-base text-[#6B7888] font-medium">Email ID</label>
        <input type="email" bind:value={email} class="input" placeholder="Enter your email">
      </div>
  
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class=" text-base  text-[#6B7888] font-medium">Hospital Name</label>
        <input type="text" bind:value={hospitalName} class="input" placeholder="Enter hospital name">
      </div>
  
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class=" text-base text-[#6B7888] font-medium">Hospital Type</label>
        <select bind:value={hospitalType} class="input">
          <option value="" disabled selected>--</option>
          {#each hospitalTypes as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </div>
  
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
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
        <!-- svelte-ignore a11y_label_has_associated_control -->
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
        <!-- svelte-ignore a11y_label_has_associated_control -->
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