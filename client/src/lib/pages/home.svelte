<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { Motion } from "svelte-motion";
    import { fade } from "svelte/transition"; 

    let cards = [
        { id: 1, height: 360, isActive: false, type: "image", imageUrl: "/your-image-path.jpg" },
        { id: 2, height: 360, isActive: false, type: "buttons", buttons: ["Book Now", "Learn More"] },
        { id: 3, height: 360, isActive: false, type: "text", content: "Advanced Reporting & Insights for hospitals." }
    ];

    let activeIndex = 0;
    let previousIndex = -1;
    let animationInterval: number;
    let manualOverride = false;

    function animateCard(index: number, override = false) {
        if (!override) manualOverride = false; // Reset override flag if it's an automatic animation
        if (manualOverride && !override) return; // If manually triggered, ignore automatic animation

        previousIndex = activeIndex;
        activeIndex = index;

        // Reset all cards
        cards = cards.map((card, i) => ({
            ...card,
            height: i === index ? 1200 : 360,
            isActive: i === index
        }));

        setTimeout(() => {
            cards[index].height = 360;
            cards = [...cards];

            setTimeout(() => {
                if (previousIndex !== -1) {
                    cards[previousIndex].isActive = false;
                    cards = [...cards];
                }
            }, 1000);
        }, 1000);
    }

    function handleClick(index: number) {
        manualOverride = true; // Stop automatic animation
        clearInterval(animationInterval);
        animateCard(index, true);

        // Resume animation from index 0 after 3 seconds
        setTimeout(() => {
            manualOverride = false;
            startAnimation();
        }, 3000);
    }

    function startAnimation() {
        clearInterval(animationInterval);
        animationInterval = setInterval(() => {
            animateCard((activeIndex + 1) % cards.length);
        }, 2000);
    }

    onMount(() => {
        startAnimation();
    });

    onDestroy(() => {
        clearInterval(animationInterval);
    });
</script>

<main class="bg-[#F3F9F9]">
    <section class="pt-10">
        <div class="flex figtree justify-center items-center flex-col">
            <p class="xl:text-6xl lg:text-5xl md:text-4xl text-3xl xl:w-3/5 w-5/6 font-bold !leading-normal text-center">
                Transform Your <span class="text-[#178490]">Hospital's Appointment</span> System with Ease
            </p>
            <p class="lg:my-10 my-5 xl:text-xl  md:text-lg text-sm text-center lg:w-1/2 w-5/6">
                Our secure and customizable app & website solution is designed to simplify hospital operations and enhance patient care.
            </p>
            <button class="bg-[#178490] rounded-md px-5 py-3 text-[#F9F9F9] font-semibold lg:text-2xl text-xl">
                Start Your Journey
            </button>
        </div>
    </section>

    <section class="lg:grid grid-cols-3  hidden lg:gap-16 gap-6 items-end xl:h-[55vh] md:h-[65vh] lg:px-20 md:px-8">
        {#each cards as card, index}
            <Motion let:motion animate={{ height: card.height }} transition={{ duration: 1, ease: "easeOut" }}>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    use:motion
                    class="relative rounded-t-[40px] bg-gradient-to-t shadow-lg p-6 flex items-center justify-center transition-all duration-500 overflow-hidden"
                    style="height: {card.height}px; background: linear-gradient(178.97deg, #FFFFFF 41.39%, #44A7B2 222.76%);"
                    onclick={() => handleClick(index)}
                >
                    {#if card.isActive}
                    <div
                        transition:fade={{ duration: 300 }} 
                        class="absolute inset-0 rounded-t-[42px] border-8 border-transparent"
                        style="
                            background: linear-gradient(178.97deg, #FFFFFF 41.39%, #44A7B2 222.76%) padding-box,
                                        linear-gradient(1deg, #FFFFFF 1%, #44A7B2 222.76%) border-box;
                            -webkit-mask: linear-gradient(to bottom, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%);
                            mask: linear-gradient(to bottom, rgba(0,0,0,1) 1%, rgba(0,0,0,0) 100%);
                        "
                    ></div>
                    {/if}

                    <!-- UNIQUE CARD CONTENT -->
                    <div class="relative z-10 text-center h-full">
                        {#if card.type === "image"}
                          <div class="">
                            <div class="flex flex-col items-center gap-3">
                               <h1 class="font-bold text-lg text-center">
                                Effortless Appointment & Rescheduling
                               </h1>
                               <p class="text-sm w-4/5 text-center font-sans">
                                Patients can easily make appointments & reschedule appointments, reducing missed visits.
                               </p>
                            </div>
                            <div class="w-full mt-3">
                                <div class="relative">
                                    <img src="/images/Date Picker.png" alt="" class="w-[190px] h-56 absolute left-0">
                                </div>
                                <div class="relative">
                                    <img src="/images/Card.png" alt="" class="w-72 absolute top-20 right-0">
                                </div>
                            </div>
                          </div>
                        {:else if card.type === "buttons"}
                        <div>
                            <div class="flex flex-col items-center gap-3 h-auto">
                                <h1 class="font-bold text-lg text-center">
                                Token management System
                                </h1>
                                <p class="text-sm w-4/5 text-center font-sans">
                                    Streamline patient flow with real-time token alerts and notifications.
                                </p>
                             </div>
                             <div class="bg-white pb-20 flex-1 flex mt-5 h-full">
                                <img src="/images/Frame 98.png" alt="">
                             </div>
                             <!-- <div class="w-full mt-5 bg-white h-full">
                                <div class=" border-2 p-3 rounded-t-xl border-slate-100">
                                    <h1 class="font-sans text-left  text-[#292D32] font-bold text-base">
                                        Your Appointments
                                    </h1>
                                    <div class={`border p-3 py-5 mt-3 rounded-t-xl border-slate-200/80 flex flex-col gap-5 `}>
                                        <div class="flex items-center w-full border-b border-slate-200/90 py-2 pb-4 relative">
                                            <div class="flex justify-center items-center">
                                                <img src="/images/buildings.png" class="h-5 w-5" alt="">
                                            </div>
                                        
                                            <div class="flex flex-col px-5">
                                                <p class="font-bold text-left">Sheraj Hospital</p>
                                                <div class="flex gap-5">
                                                    <p class="flex items-center gap-2">
                                                        <img src="/images/calendar-2.png" class="h-4 w-4" alt="">
                                                        <span>28 Jan</span>
                                                    </p>
                                                    <p class="flex items-center gap-2">
                                                        <img src="/images/clock.png" class="h-4 w-4" alt="">
                                                        <span>4:30 PM</span>
                                                    </p>
                                                </div>
                                            </div>
                                        
                                            <div class="ml-auto">
                                                <h1 class="p-2 border border-[#1D7885] rounded-lg bg-[#EBF3F4] text-[#1D7885]">
                                                    Token: 09
                                                </h1>
                                            </div>
                                        </div>
                                        <div class="flex items-center w-full border-b border-slate-200/90 py-2 pb-4 relative">
                                            <div class="flex justify-center items-center">
                                                <img src="/images/buildings.png" class="h-5 w-5" alt="">
                                            </div>
                                        
                                            <div class="flex flex-col px-5">
                                                <p class="font-bold text-left">MM Hospital</p>
                                                <div class="flex gap-5">
                                                    <p class="flex items-center gap-2">
                                                        <img src="/images/calendar-2.png" class="h-4 w-4" alt="">
                                                        <span>17 Jan</span>
                                                    </p>
                                                    <p class="flex items-center gap-2">
                                                        <img src="/images/clock.png" class="h-4 w-4" alt="">
                                                        <span>10:45 AM</span>
                                                    </p>
                                                </div>
                                            </div>
                                        
                                            <div class="ml-auto">
                                                <h1 class="p-2 border border-[#1D7885] rounded-lg bg-[#EBF3F4] text-[#1D7885]">
                                                    Token: 14
                                                </h1>
                                            </div>
                                        </div>
                                        
<div class="flex items-center w-full border-b border-slate-200/90 py-2 pb-4 relative">
    <div class="flex justify-center items-center">
        <img src="/images/buildings.png" class="h-5 w-5" alt="">
    </div>

    <div class="flex flex-col px-5">
        <p class="font-bold text-left">Nehru Mahendra Hospital</p>
        <div class="flex gap-5">
            <p class="flex items-center gap-2">
                <img src="/images/calendar-2.png" class="h-4 w-4" alt="">
                <span>28 Jan</span>
            </p>
            <p class="flex items-center gap-2">
                <img src="/images/clock.png" class="h-4 w-4" alt="">
                <span>4:30 PM</span>
            </p>
        </div>
    </div>

    <div class="ml-auto">
        <h1 class="p-2 border border-[#1D7885] rounded-lg bg-[#EBF3F4] text-[#1D7885]">
            Token: 09
        </h1>
    </div>
</div>


                                    </div>
                                </div>
                             </div> -->
                        </div>
                        {:else if card.type === "text"}
                        <div class="">
                            <div class="flex flex-col items-center gap-3">
                               <h1 class="font-bold text-lg text-center">
                                Effortless Appointment & Rescheduling
                               </h1>
                               <p class="text-sm w-4/5 text-center font-sans">
                                Patients can easily make appointments & reschedule appointments, reducing missed visits.
                               </p>
                            </div>
                            <div class="w-full mt-3">
                                <div class="relative">
                                    <img src="/images/Date.png" alt="" class="w-[90%]  absolute left-0">
                                </div>
                                <div class="relative">
                                    <img src="/images/Group 5.png" alt="" class="w-72 absolute top-50 right-0">
                                </div>
                            </div>
                          </div>
                        {/if}
                    </div>
                </div>
            </Motion>
        {/each}
    </section>
    <div class="w-full flex justify-center items-center">
        <section class="block md:w-3/4 lg:hidden  space-y-6 px-5 py-10">
            {#each cards as card}
              {#if card.type === "image"}
                <!-- Image Card -->
                <div class="relative p-[2px] rounded-xl">
                  <div
                    class="relative flex items-center gap-4 bg-white p-4 rounded-xl border-2"
                    style="border-image-source: linear-gradient(289.38deg, rgba(23, 132, 144, 0.06) 28.21%, #DFEFF0 56.42%);
                           border-image-slice: 1;"
                  >
                    <!-- Image Container -->
                    <div class="relative flex-shrink-0">
                      <img src="/images/Date Picker.png" alt="" class="w-[60px] h-[50px] object-contain" />
                      <img src="/images/Card.png" alt="" class="absolute -bottom-[15px] right-0 w-[40px]" />
                    </div>
          
                    <!-- Text Content -->
                    <div class="flex flex-col gap-2">
                      <h1 class="font-bold text-lg text-left">
                        Effortless Appointment & Rescheduling
                      </h1>
                      <p class="text-xs md:text-sm font-sans text-left w-full">
                        Patients can easily make appointments & reschedule appointments, reducing missed visits.
                      </p>
                    </div>
                  </div>
                </div>
          
              {:else if card.type === "buttons"}
                <!-- Button Card -->
                <div class="relative p-[2px] rounded-xl">
                  <div class="flex items-center gap-4 bg-white p-4 rounded-xl border-2"
                       style="border-image-source: linear-gradient(289.38deg, rgba(23, 132, 144, 0.06) 28.21%, #DFEFF0 56.42%);
                              border-image-slice: 1;">
                    
                    <!-- Image in Front -->
                    <div class="flex-shrink-0">
                      <img src="/images/Frame 98.png" class="w-[55px] h-[50px]" alt="">
                    </div>
          
                    <!-- Text Content -->
                    <div class="flex flex-col gap-2">
                      <h1 class="font-bold text-lg">
                        Token Management System
                      </h1>
                      <p class="text-xs md:text-sm font-sans">
                        Streamline patient flow with real-time token alerts and notifications.
                      </p>
                    </div>
                  </div>
                </div>
          
              {:else if card.type === "text"}
                <!-- Text Card -->
                <div class="relative p-[2px] rounded-xl">
                  <div class="flex items-center gap-4 bg-white p-4 rounded-xl border-2"
                       style="border-image-source: linear-gradient(289.38deg, rgba(23, 132, 144, 0.06) 28.21%, #DFEFF0 56.42%);
                              border-image-slice: 1;">
                    
                    <!-- Image in Front -->
                    <div class="flex-shrink-0">
                      <img src="/images/Date.png" alt="" class="w-[60px] h-[50px]">
                    </div>
          
                    <!-- Text Content -->
                    <div class="flex flex-col gap-2">
                      <h1 class="font-bold text-lg  text-left">
                        Effortless Appointment & Rescheduling
                      </h1>
                      <p class="text-xs md:text-sm font-sans text-left w-full">
                        Patients can easily make appointments & reschedule appointments, reducing missed visits.
                      </p>
                    </div>
                  </div>
                </div>
          
              {/if}
            {/each}
          </section>
    </div>
 
      
      
      
      
</main>
