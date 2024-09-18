<script lang="ts">
import { ref, defineComponent, reactive } from 'vue';
import { userForm } from 'src/types/user';

export default defineComponent({
  props: {

    formData: {
      type: Object as () => userForm | undefined,
    }
  },
  emits: ['on:confirm', 'on:cancel'],
  setup(props, { emit }) {

    const form = reactive<userForm>({
      old_password: '',
      new_password: '',
      confirm_password: '',
    });
    const onUpdate = () => {
      emit('on:confirm', form)
    }
    const onCancel = () => {
      emit('on:cancel')
    }
    return {
      props,
      form,
      isPwd: ref(false),
      dense: ref(false),
      emit,
      onUpdate,
      onCancel
    }
  }
})

</script>
<template>
  <div>
    <q-form>
      <div style="max-width: 300px;">
        <q-input bottom-slots v-model="form.old_password" label="旧密码" :type="isPwd ? 'password' : 'text'">
          <template v-slot:prepend>
            <q-icon name="fa-solid fa-lock" />
          </template>
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
        </q-input>
      </div>
    </q-form>
    <div>
      <q-btn push color="primary" label="取消" @click="onCancel" />
      <q-btn push color="primary" label="修改" @click="onUpdate" />
    </div>
  </div>
</template>
<style scoped></style>
