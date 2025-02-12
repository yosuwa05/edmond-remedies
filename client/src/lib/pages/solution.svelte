<script>
    import { slide } from "svelte/transition";
    let isHovered1=false;
    let isHovered2=false;
    let isHovered3=false;
</script>

<main class="lg:px-20 md:px-10 lg:py-20 px-5 py-10 bg-[#C5DFE2]/20">
 <div class="flex flex-col items-center justify-center lg:gap-5 gap-2">
    <p class="text-[#178490] font-sans font-medium text-base">
        Solutions we have
    </p>
    <h1 class="text-[#252525] !leading-relaxed text-center  font-semibold text-3xl lg:text-5xl">
        Simplify Appointments & <br /> Boost Productivity.
    </h1>
    <p class=" lg:text-xl text-base text-center text-[#3E3E3E] lg:w-1/2">
        Automate scheduling, reduce errors, save time, and enhance patient experience for seamless hospital efficiency.
    </p>
 </div>
<div class=" lg:flex  hidden  lg:gap-32 lg:mt-24 gap-5 mt-5">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
    on:mouseenter={() => (isHovered1 = true)}
    on:mouseleave={() => (isHovered1 = false)}
    class="flex flex-col justify-center items-center gap-5">
            {#if isHovered1}
            <!-- Video Content -->
            <div
            style="background: linear-gradient(180deg, #F9F9F9 72.07%, rgba(156, 211, 217, 0.17) 353.99%);" 
            class="border border-[#178490] px-4 py-3 rounded-xl">
            <img src="/video/calendar.gif" alt="Lock Animation" class="h-12 w-12 rounded-lg">
            </div>
          {:else}
            <!-- Image -->
            <div
            style="background: linear-gradient(180deg, #F9F9F9 72.07%, rgba(156, 211, 217, 0.17) 353.99%);" 
            class="border border-[#178490] px-5 py-4 rounded-xl">
            <img src="/images/january-1 1.png" alt="" class="h-10 w-10">

            </div>
          {/if}
        <div>
    <h1 class=" font-semibold text-2xl text-center">Streamlined Booking System</h1>
        </div>
        <div>
    <p class="text-[#3E3E3E] leading-normal text-center text-xl">Our doctor appointment app automates bookings and eliminates scheduling conflicts.</p>
        </div>
     </div>
     <!-- svelte-ignore a11y_no_static_element_interactions -->
     <div
     on:mouseenter={() => (isHovered2 = true)}
     on:mouseleave={() => (isHovered2 = false)} 
     class="flex flex-col justify-center items-center gap-5">
        
            {#if isHovered2}
            <!-- Video Content -->
            <div
            style="background: linear-gradient(180deg, #F9F9F9 72.07%, rgba(156, 211, 217, 0.17) 353.99%);" 
            class="border border-[#178490] px-2 py-1 rounded-xl">
            <img src="/video/lock.gif" alt="Lock Animation" class="h-16 w-16 rounded-lg">
            </div>
          {:else}
            <!-- Image -->
            <div
            style="background: linear-gradient(180deg, #F9F9F9 72.07%, rgba(156, 211, 217, 0.17) 353.99%);" 
            class="border border-[#178490] px-5 py-4 rounded-xl">
            <img src="/images/anti-theft 1.png" alt="" class="h-10 w-10">
            </div>
          {/if}
        <div>
    <h1 class=" font-semibold text-2xl text-center">Secure Patient Management</h1>
        </div>
        <div>
    <p class="text-[#3E3E3E] leading-normal text-center text-xl">Easily manage appointments, rescheduling, and notifications through a centralized, user-friendly platform.</p>
        </div>
     </div>
     <!-- svelte-ignore a11y_no_static_element_interactions -->
     <div
     on:mouseenter={() => (isHovered3 = true)}
     on:mouseleave={() => (isHovered3 = false)}
     class="flex flex-col justify-center items-center gap-5">
            {#if isHovered3}
            <!-- Video Content -->
            <div
            style="background: linear-gradient(180deg, #F9F9F9 72.07%, rgba(156, 211, 217, 0.17) 353.99%);" 
            class="border border-[#178490] px-3 py-2 rounded-xl"
            >
            <img src="/video/list.gif" alt="Lock Animation" class="h-14 w-14 rounded-lg" >
            </div>
          {:else}
            <!-- Image -->
            <div
            style="background: linear-gradient(180deg, #F9F9F9 72.07%, rgba(156, 211, 217, 0.17) 353.99%);" 
            class="border border-[#178490] px-5 py-4 rounded-xl">
            <img src="/images/data-analysis 1.png" alt="" class="h-10 w-10">
            </div>
          {/if}
        <div>
    <h1 class=" font-semibold text-2xl text-center">Data Privacy Guaranteed:</h1>
        </div>
        <div>
    <p class="text-[#3E3E3E] leading-normal text-center text-xl">With dedicated databases and two-factor authentication, your hospital's data stays fully secure.</p>
        </div>
     </div>
</div>
<div class=" flex  lg:hidden flex-col gap-5 mt-5">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
    class="flex justify-start items-center gap-5">
    <div
    style="background: linear-gradient(180deg, #F9F9F9 72.07%, rgba(156, 211, 217, 0.17) 353.99%);" 
    class="border border-[#178490] px-3 py-2 md:px-4 md:py-3 rounded-lg">
    <img src="/images/january-1 1.png" alt="" class="h-9 w-16 md:h-10 md:w-10">

    </div>
        <div>
    <h1 class=" font-semibold text-lg text-left">Streamlined Booking System</h1>
    
    <p class="text-[#3E3E3E] leading-normal text-left text-base">Our doctor appointment app automates bookings and eliminates scheduling conflicts.</p>
        </div>
     </div>
     <!-- svelte-ignore a11y_no_static_element_interactions -->
     <div
     class="flex justify-start items-center gap-5">    
            <div
            style="background: linear-gradient(180deg, #F9F9F9 72.07%, rgba(156, 211, 217, 0.17) 353.99%);" 
            class="border border-[#178490] px-3 py-3 md:px-4 md:py-3 rounded-lg">
            <img src="/images/anti-theft 1.png" alt="" class="h-8 w-20 md:h-10 md:w-10">
            </div>
        <div>
    <h1 class=" font-semibold text-lg text-left">Secure Patient Management</h1>
      
    <p class="text-[#3E3E3E] leading-normal text-left text-base">Easily manage appointments, rescheduling, and notifications through a centralized, user-friendly platform.</p>
        </div>
     </div>
     <!-- svelte-ignore a11y_no_static_element_interactions -->
     <div
     class="flex  justify-start items-center gap-5">

            <div
            style="background: linear-gradient(180deg, #F9F9F9 72.07%, rgba(156, 211, 217, 0.17) 353.99%);" 
            class="border border-[#178490] px-3 py-2 md:px-4 md:py-4 rounded-lg">
            <img src="/images/data-analysis 1.png" alt="" class="h-10 w-20 md:h-9 md:w-10">
            </div>
        <div>
    <h1 class=" font-semibold text-lg text-left">Data Privacy Guaranteed:</h1>
    
    <p class="text-[#3E3E3E] leading-normal text-left text-base">With dedicated databases and two-factor authentication, your hospital's data stays fully secure.</p>
        </div>
     </div>
</div>
</main>