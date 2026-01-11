using Microsoft.EntityFrameworkCore;
using PMS.Api.Models;

namespace PMS.Api.Data
{
    public class PmsDbContext : DbContext
    {
        public PmsDbContext(DbContextOptions<PmsDbContext> options) : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<ATask> Tasks { get; set; }
        public DbSet<SubTask> SubTasks { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Name = "Default User"
                }
            );
        }
    }
}
