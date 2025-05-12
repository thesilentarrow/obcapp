package expo.modules.mymodule

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.auth.api.phone.SmsRetrieverClient
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status
import com.google.android.gms.tasks.Task
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

class MyModule : Module() {
  private var smsReceiver: BroadcastReceiver? = null

  override fun definition() = ModuleDefinition {
    Name("MyModule")

    Constants(
      "PI" to Math.PI
    )

    Events("onSmsReceived")
    
    AsyncFunction("startSmsRetriever") {
      val result = startSmsRetriever()
      return@AsyncFunction result
    }
    
    AsyncFunction("getAppSignature") {
      val signatures = appContext.reactContext?.applicationContext?.let { 
        AppSignatureHelper(it).getAppSignatures() 
      }
      return@AsyncFunction signatures?.firstOrNull() ?: ""
    }
    
    OnDestroy {  
      unregisterReceiver()
    }
  }
  
  private suspend fun startSmsRetriever(): String = suspendCoroutine { continuation ->
    try {
      val client = SmsRetriever.getClient(appContext.reactContext!!)
      val task: Task<Void> = client.startSmsRetriever()
      
      task.addOnSuccessListener {
        // Successfully started SMS retriever
        registerBroadcastReceiver()
        continuation.resume("SMS retriever started")
      }
      
      task.addOnFailureListener { e ->
        continuation.resumeWithException(e)
      }
    } catch (e: Exception) {
      continuation.resumeWithException(e)
    }
  }
  
  private fun registerBroadcastReceiver() {
    try {
      unregisterReceiver() // Unregister any existing receiver
      
      smsReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
          if (SmsRetriever.SMS_RETRIEVED_ACTION == intent.action) {
            val extras = intent.extras
            val status = extras?.get(SmsRetriever.EXTRA_STATUS) as Status
            
            when (status.statusCode) {
              CommonStatusCodes.SUCCESS -> {
                // Get SMS message contents
                val message = extras.getString(SmsRetriever.EXTRA_SMS_MESSAGE)
                sendEvent("onSmsReceived", mapOf("message" to message))
              }
              CommonStatusCodes.TIMEOUT -> {
                sendEvent("onSmsReceived", mapOf("error" to "Timeout"))
              }
            }
            
            // Unregister after receiving
            unregisterReceiver()
          }
        }
      }
      
      val intentFilter = IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION)
      appContext.reactContext?.registerReceiver(smsReceiver, intentFilter)
    } catch (e: Exception) {
      // Handle exception
    }
  }
  
  private fun unregisterReceiver() {
    try {
      if (smsReceiver != null) {
        appContext.reactContext?.unregisterReceiver(smsReceiver)
        smsReceiver = null
      }
    } catch (e: Exception) {
      // Ignore if receiver is not registered
    }
  }
}