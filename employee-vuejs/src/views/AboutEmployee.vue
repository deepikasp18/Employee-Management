<template>
  <div class="home">

    <EmployeeManagement />
  </div>
</template>

<script>
// @ is an alias to /src
import EmployeeManagement from '@/components/Employee.vue'

export default {
  name: 'AboutEmployee ',
  components: {
    EmployeeManagement
  }
}
</script>
