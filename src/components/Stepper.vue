<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-stepper v-model="step" ref="stepper" color="primary" vertical animated>
      <q-step :name="1" title="未付款" icon="settings" :done="step > 1">
      </q-step>

      <q-step
        :name="2"
        title="已付款"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
      </q-step>

      <q-step :name="3" title="已发货" icon="assignment" :done="step > 3">
      </q-step>

      <q-step :name="4" title="已收货" icon="add_comment"> </q-step>

      <!-- <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepper.next()"
            color="primary"
            :label="step === 4 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template> -->
    </q-stepper>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    return {
      step: ref(4),
    };
  },
};
</script>
