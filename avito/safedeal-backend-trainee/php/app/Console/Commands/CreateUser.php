<?php

namespace App\Console\Commands;

use App\Role;
use App\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CreateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create {email} {username?} {--role=*}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create new user';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $email = $this->argument('email');
        $username = $this->argument('username') ?: '';
        $rolesNames = $this->option('role');

        if (!$rolesNames) {
            $this->error('Specify at least one role');
            return;
        }
        $roles = [];
        foreach ($rolesNames as $name) {
            $role = Role::where('name', $name)->first();
            if (!$role) {
                $this->error("Role '{$name}' is not defined");
                return;
            } else {
                $roles[] = $role;
            }
        }

        $password = $this->secret('password');
        $confirm = $this->secret('confirm password');

        if ($password != $confirm) {
            $this->error('Passwords mismatch');
            return;
        }

        $validator = Validator::make(['email' => $email, 'password' => $password], [
            'email' => 'email',
            'password' => 'min:1'
        ]);

        if ($validator->fails()) {
            $this->error('Invalid credentials');
            return;
        }

        $user = User::where('email', '=', $email)->first();
        if ($user != null) {
            $this->error('User with such email is already exists');
            return;
        }

        DB::transaction(function () use ($username, $email, $password, $roles) {
            $user = new User();
            $user->name = $username;
            $user->email = $email;
            $user->email_verified_at = now();
            $user->password = Hash::make($password);
            $user->remember_token = Str::random(10);
            $user->save();

            foreach ($roles as $role) {
                $user->roles()->attach($role);
            }
        });

        $this->info('Successfully added user');
    }
}
