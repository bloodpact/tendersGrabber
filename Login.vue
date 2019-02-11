<template>
    <div>
        <form class="custom-form" v-on:submit="onSubmit">
            <div class="form-group">
                <label for="username">Login name</label>
                <input type="email" class="form-control" id="username">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Password">
            </div>
            <button type="submit" class="btn btn-secondary">Submit</button>
        </form>
    </div>
</template>

<script>
    import * as auth from '../../services/AuthService'
    export default{
        name: 'login',
        methods:{
            onSubmit: function (e) {
                e.preventDefault();
                auth.login()
                this.$router.push({name: 'home'})
            }
        }
    }
</script>
