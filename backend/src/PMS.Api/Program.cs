using Microsoft.EntityFrameworkCore;
using PMS.Api.Data;
using PMS.Api.Services;
using System;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PmsDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();  

builder.Services.AddScoped<ProjectServices>();
builder.Services.AddScoped<TaskServices>();
builder.Services.AddScoped<SubTaskServices>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();