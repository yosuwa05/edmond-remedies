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
    let lastClickedIndex = -1;
    let isAnimating = false;

    function animateCard(index: number, override = false) {
        if (isAnimating) return; // Prevent animation if one is already in progress
        isAnimating = true;

        if (!override) manualOverride = false;
        if (manualOverride && !override) return;

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
                isAnimating = false; // Animation is complete
            }, 800);
        }, 800);
    }

    function handleClick(index: number) {
        if (index === lastClickedIndex || isAnimating) return; // Prevent continuous clicks or clicks during animation
        
        manualOverride = true;
        clearInterval(animationInterval);
        animateCard(index, true);
        lastClickedIndex = index;

        // Resume animation from the next index after 3 seconds
        setTimeout(() => {
            manualOverride = false;
            lastClickedIndex = -1; // Reset last clicked index
            startAnimation((index + 1) % cards.length);
        }, 2000);
    }

    function startAnimation(startIndex = 0) {
        clearInterval(animationInterval);
        animationInterval = setInterval(() => {
            if (!manualOverride) {
                animateCard((activeIndex + 1) % cards.length);
            }
        }, 2000);
    }

    onMount(() => {
        startAnimation();
    });

    onDestroy(() => {
        clearInterval(animationInterval);
    });
</script>

<main class="bg-[#F3F9F9] ">
    <section class="pt-10">
        <div class="flex figtree justify-center items-center flex-col">
            <p class="xl:text-6xl lg:text-5xl md:text-4xl text-3xl xl:w-3/5 md:w-5/6  px-2 font-bold !leading-normal text-center">
                Transform Your <span class="text-[#178490]"> <br class="md:hidden block"/>Hospital's Appointment <br class="md:hidden block"/></span> System with Ease
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
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                    use:motion
                    class="relative rounded-t-[40px] bg-gradient-to-t shadow-lg p-6 flex items-center justify-center transition-all duration-500 overflow-hidden"
                    style="height: {card.height}px; background: linear-gradient(178.97deg, #FFFFFF 41.39%, #44A7B2 222.76%);"
                    on:click={() => handleClick(index)}
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
        <section class="block md:w-3/4 lg:hidden  md:space-y-10 space-y-6 px-5 py-10">
            {#each cards as card}
              {#if card.type === "image"}
                <!-- Image Card -->
                <div class="relative p-[2px] rounded-xl" >
                    <div
                    class="absolute inset-0 rounded-[16px] border-2 border-transparent"
                    style="
                      background: linear-gradient(289.38deg, rgba(23, 132, 144, 0.06) 28.21%, #DFEFF0 56.42%) padding-box,
                                  linear-gradient(289.38deg, rgba(23, 132, 144, 0.06) 28.21%, #DFEFF0 56.42%) border-box;
                    "
                  ></div>
                  <div
                    class="relative z-10 flex items-center gap-4 bg-white p-4 rounded-2xl "
                    style="background: linear-gradient(149.2deg, #FFFFFF 44.55%, #44A7B2 362.07%);"
                    >
                    <!-- Image Container -->
                    <div class="relative flex-shrink-0">
                      <img src="/images/Date Picker.png" alt="" class="w-[60px] h-[50px] object-contain" />
                      <img src="/images/Card.png" alt="" class="absolute -bottom-[15px] right-0 w-[40px]" />
                    </div>
          
                    <!-- Text Content -->
                    <div class="flex flex-col gap-2">
                      <h1 class="font-bold md:text-lg text-sm text-left">
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
                    <div
                    class="absolute inset-0 rounded-[16px] border-2 border-transparent"
                    style="
                      background: linear-gradient(289.38deg, rgba(23, 132, 144, 0.06) 28.21%, #DFEFF0 56.42%) padding-box,
                                  linear-gradient(289.38deg, rgba(23, 132, 144, 0.06) 28.21%, #DFEFF0 56.42%) border-box;
                    "
                  ></div>
                  <div class=" relative z-10 flex items-center gap-4 bg-white p-4 rounded-2xl"
                  style="background: linear-gradient(149.2deg, #FFFFFF 44.55%, #44A7B2 362.07%);"
                  >
                    
                    <!-- Image in Front -->
                    <div class="flex-shrink-0">
                      <img src="/images/Frame 98.png" class="w-[55px] h-[50px]" alt="">
                    </div>
          
                    <!-- Text Content -->
                    <div class="flex flex-col gap-2">
                      <h1 class="font-bold md:text-lg text-sm">
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
                    <div
                    class="absolute inset-0 rounded-[16px] border-2 border-transparent"
                    style="
                      background: linear-gradient(289.38deg, rgba(23, 132, 144, 0.06) 28.21%, #DFEFF0 56.42%) padding-box,
                                  linear-gradient(289.38deg, rgba(23, 132, 144, 0.06) 28.21%, #DFEFF0 56.42%) border-box;
                    "
                  ></div>
                  <div class="flex relative z-10 items-center gap-4 bg-white p-4 rounded-2xl "
                  style="background: linear-gradient(149.2deg, #FFFFFF 44.55%, #44A7B2 362.07%);"   
                  >
                    
                    <!-- Image in Front -->
                    <div class="flex-shrink-0">
                      <img src="/images/Date.png" alt="" class="w-[60px] h-[50px]">
                    </div>
          
                    <!-- Text Content -->
                    <div class="flex flex-col gap-2 ">
                      <h1 class="font-bold md:text-lg text-sm  text-left">
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

